// bpReid 2016

	var table_left_margin = 60, table_top_margin = 40;
	var element_width     = 40, element_height   = 40;
	var shade_selection  = "no_shading";
	var puzzle_selection = "no_puzzle";
	var element_to_solve = -1;
	var ge_rects, rects, numbers;
	var displayed_element = 0;
	var title_text, symbol_text, name_text, number_text, mass_text, shade_text;
	var puzzle_counter, previous_puzzle, first_puzzle = true;
	var score, last_answer, trend;
	var feedback_color        = "#117711";
	var default_element_color = "#dddddd";
	var emoji_san;
	var emojis = {
		'0':'neutral_face', 
		'6':'joy',      '-6':'scream',
		'5':'smiley',   '-5':'anguished', 
		'4':'wink',     '-4':'worried',   
		'3':'smile',    '-3':'open_mouth',      
		'2':'grinning', '-2':'frowning',
		'1':'relieved', '-1':'confused'
		};
	var drag_x_limit, drag_y_limit;
	var off_left, off_top, off_right, off_bottom;
	var x_start, y_start;
	

	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")	
		 .attr("class", "tooltip")				
		 .style("opacity", 0);
	
	$("#shade_options").on("click", "li", function(event){
		shade_selection = $(this).find('a').attr('id');
		heatmapColour = d3.scale.quantize()
		  .domain(d3.extent(elements, function(d){ return +d[shade_selection];}))
		  .range(colorbrewer.YlOrRd[numColors]);
		ge_rects.selectAll("rect")	
			.style("fill", function(d) {
				if (shade_selection=="no_shading") return default_element_color;
				else return color_map_value( +d[shade_selection]);
			});
		display_shading_legend(shade_selection);
	});

	$("#solve_options").on("click", "li", function(event){
		var solve_selection = $(this).find('a').attr('id');
		if (solve_selection=="solve_all") {
			solve_puzzle(previous_puzzle,feedback_color, "2", 1000, "default")		
		} else	{
				if (element_to_solve > 0) {
					var element_unit = d3.select("#ge_rect"+element_to_solve);
					element_unit
						.transition()
						.duration(200)
						.attr("transform", function(d) {
							var x = table_left_margin + (d.column-1)*element_width ;
							var y = table_top_margin  + (d.row   -1)*element_height;
							return "translate("+x+","+y+")";
						});
					element_unit
						.on(".drag", null)
						.attr("cursor", "default");
					element_unit.select("rect")
						.style("stroke", feedback_color)
						.style("stroke-width", "2");
				}
		}	
	});


	$("#puzzle_options").on("click", "li", function(event){
		puzzle_selection = $(this).find('a').attr('id');
		
		if (puzzle_selection=="no_puzzle") {
			solve_puzzle(previous_puzzle,"#333", "1", 250, "pointer")
			numbers.text(function(d) {return d.number;});		
			feedback_text.attr( "fill-opacity", 0 ).transition().delay(100).attr("fill-opacity", 1).duration(500).text("");
			emoji_san.remove();
			$("#solve_menu").addClass('disabled');
		} 
		else 
		{
			if (typeof emoji_san !== 'undefined') {emoji_san.remove();}
			emoji_san = svg.append('emoji')
				.attr('width', 30)
				.attr('height', 30)
// 				.attr("x",5.6*element_width)
// 				.attr("y",2.3*element_height)
				.attr("x",table_left_margin + 18.3*element_width)
				.attr("y",table_top_margin  + 9.8*element_height)
				.attr('symbol', 'neutral_face'); // codes taken from http://www.emoji-cheat-sheet.com/ the enclosing :colons: aren't necessary
			numbers.text(""); 
			puzzle_counter = families[puzzle_selection].length;
			score = 0;
			last_answer = 0;
			trend = 0;
			feedback_text.attr( "fill-opacity", 0 ).transition().delay(100).attr("fill-opacity", 1).duration(500).text("Score: "+score);
			no_display_element();

			if (first_puzzle) { // send frame to back
				$.each(elements, function(index, element){
					svg.append("rect")
					.attr("id", "frame_rect"+element.number)
					.attr("x", table_left_margin + (element.column-1)*element_width )
					.attr("y", table_top_margin  + (element.row-1   )*element_height)
					.attr("width",  element_width)
					.attr("height", element_height)
					.style("stroke", "#333")
					.style("fill-opacity","0")
					.moveToBack();
				 });
				first_puzzle = false;
			} else {  // Clean up any old puzzle
				solve_puzzle(previous_puzzle,"#333", "1", 250, "default")
			}
			$("#solve_menu").removeClass('disabled');
			previous_puzzle = puzzle_selection;		
			
			// set up locations for spread out puzzle pieces
			var locations = [];
			for (var i = family_locations[puzzle_selection][0]; i <= family_locations[puzzle_selection][1]; i++){
				locations.push(i);	
			}	
			$.each(families[puzzle_selection], function(index, value){
			
				var location_index = getRandomArbitrary(0, locations.length);
				var rand_x = edge_locations[locations[location_index]][1];		
				var rand_y = edge_locations[locations[location_index]][0];	
				locations.splice(location_index,1);
 				var delta_x = (Math.random()-0.5)*element_width/2;		
 				var delta_y = (Math.random()-0.5)*element_height/2;	
				var element_unit = d3.select("#ge_rect"+value);
				element_unit
					.transition()
					.duration(500)
					.attr("transform", function(d) {
						var x = (rand_x-1)*element_width  + delta_x;
						var y = (rand_y-1)*element_height + delta_y;
						return "translate("+x+","+y+")";
						})			
					.attr("cursor", "move");
				element_unit
					.on("mouseover", function(d) {		
						d3.select(this).moveToFront();
						tooltip.transition()		
							 .duration(100)		
							 .style("opacity", .9);		
						tooltip.html(d.name)	
							 .style("left", (d3.event.pageX - 15) + "px")		
							 .style("top", (d3.event.pageY + 15) + "px");	
						})					
					.call(drag)
					.moveToFront();		 
				element_unit
					.select("rect")
					.style("stroke", "#3CF")
					.style("stroke-width", "3");
			});
		}
	}); 	
  		 	
	var drag = d3.behavior.drag()
		.origin(function(d) {return d;})
		.on("dragstart", function(d,i) {
			x_start = d3.mouse(this)[0];
			y_start = d3.mouse(this)[1];
			off_top = false;
			off_bottom = false;
			off_left = false;
			off_right =false;
 			drag_x_limit = 840-element_width;
			drag_y_limit = 470-element_height;
			var x = this.transform.animVal[0].matrix.e;
			var y = this.transform.animVal[0].matrix.f;
			var reposition = false;
			if (x > drag_x_limit) {x = drag_x_limit; reposition = true;} 
			else if (x < 0) { x = 0; reposition = true;}
			if (y > drag_y_limit) {y=drag_y_limit-element_height/2; reposition=true;}
			else if (y < 0) {	y = 0;  reposition = true;}
			if (reposition) d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
			})
		.on("drag", function(d,i) {
			//http://bl.ocks.org/mbostock/1557377
			var dx = d3.event.dx;
			var dy = d3.event.dy;
			var x = this.transform.animVal[0].matrix.e;
			var y = this.transform.animVal[0].matrix.f;
			var new_x = x + dx;
			var new_y = y + dy;
			if ( off_right && d3.mouse(this)[0] <= x_start)    off_right = false;				
			if (!off_right && (x+dx)>=drag_x_limit) off_right = true;
			if ( off_right) new_x = x;
			if ( off_left && d3.mouse(this)[0] >= x_start) off_left = false;				
			if (!off_left && (x+dx)<= 0) off_left = true;	
			if ( off_left) new_x = x;
			if ( off_bottom && d3.mouse(this)[1] <= y_start) off_bottom = false;				
			if (!off_bottom && (y+dy)>=drag_y_limit) off_bottom = true;
			if ( off_bottom) new_y = y; 
			if (off_top && d3.mouse(this)[1] >= y_start) off_top = false;				
			if (!off_top && (y+dy)<= 0) off_top = true;
			if ( off_top) new_y = y;			
			
//			if ((x+dx)<drag_x_limit && (y+dy)<drag_y_limit && (x+dx)>0 && (y+dy)> 0 && d3.mouse(this)[0]<element_width && d3.mouse(this)[0]>0 &&d3.mouse(this)[1]<element_height && d3.mouse(this)[1]>0)  {
				d3.select(this).attr("transform", "translate(" + new_x + "," + new_y + ")");
				tooltip
					 .style("left", (d3.event.pageX - 15) + "px")		
					 .style("top", (d3.event.pageY + 15) + "px");	
//			}
			})
		.on("dragend", function(d,i) {  
			// d is the dragged element
			// "this" is the dragged ge_rect[0][d.number-1]
			var drop_x = (this.transform.animVal[0].matrix.e + element_width/2 - table_left_margin)/element_width;
			var drop_y = (this.transform.animVal[0].matrix.f + element_height/2 - table_top_margin)/element_height;
			// could get drop coordinates this way
			//  var transform = dragged_rect.attr("transform");
			//  var coords = transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(",");
			//  var drop_x = (parseInt(coords[0]) + element_width/2 - table_left_margin)/element_width;
			//  var drop_y = (parseInt(coords[1]) + element_height/2 - table_top_margin)/element_height;
			// test to see if drop coordinates are in home rectangle of the element
			if (drop_x >= d.column-1 && drop_x <= d.column && drop_y >= d.row-1 && drop_y <= d.row){
				var x = table_left_margin + (d.column-1)*element_width;
				var y = table_top_margin + (d.row-1)*element_height; 
				d3.select(this)
					.transition()
 					.attr("transform", "translate("+x+","+y+")")
					.duration(500)
					.ease("elastic");
				$("#"+d.number).css({"stroke": feedback_color});
				$("#"+d.number).css({"stroke-width": 2});
				
				d3.select(this).on(".drag", null)
				.attr("cursor", "default");
				puzzle_counter--;
				score = score + 5;
				feedback_text.text("Score: "+score);
				
				if (puzzle_counter==0) {
					feedback_text.attr( "fill-opacity", 0 ).transition().delay(100).attr("fill-opacity", 1).duration(500).text("Final Score: "+score);
					var average = score/(families[puzzle_selection].length - puzzle_counter);
					emoji_san.attr('symbol', emojis[Math.round(average+0.6)]);	
				} else {
					if (last_answer < 1 ) trend = 0;
					else  if (trend < 5)  trend++;	
					emoji_san.attr('symbol', emojis[trend+1]);	
					last_answer = 1;				
				}
				
			} else {
				score = score - 1 ;
				feedback_text.text("Score: "+score);
				if (last_answer > -1 ) trend = 0;
				else  if (trend > -5)  trend--;
				emoji_san.attr('symbol', emojis[trend-1]);	
				last_answer = -1;
			}		
	  	});
	  	//http://www.scribblelive.com/blog/2012/07/05/creating-animations-and-transitions-with-d3-js/
	
	var svg = d3.select("svg");

	title_text = svg.append("text")
		.attr("x",table_left_margin + 5.5*element_width)
		.attr("y",table_top_margin  + 0.5*element_height)
		.attr("font-size","200%")
		.text("Periodic Table"); //2020.10.13 Modify
	symbol_text = svg.append("text")
		.attr("x",table_left_margin + 2.5*element_width)
		.attr("y",table_top_margin  + 1.5*element_height)
		.attr("font-size","200%");
	name_text = svg.append("text")
		.attr("x",table_left_margin + 2.5*element_width)
		.attr("y",table_top_margin  + 2.1*element_height)
		.attr("font-size","150%");
	property_text = svg.append("text")
		.attr("x",table_left_margin + 2.5*element_width)
		.attr("y",table_top_margin  + 2.6*element_height)
	shade_text = svg.append("text")
		.attr("x",table_left_margin - 1.0*element_width)
		.attr("y",table_top_margin  + 10.4*element_height)
		.attr("font-size","150%");
	feedback_text = svg.append("text")
		.attr("x",table_left_margin + 18*element_width)
		.attr("y",table_top_margin  + 10.4*element_height)
		.attr("font-size","150%")
		.attr('fill',feedback_color)
		.attr('text-anchor','end');

	var element_group = svg.append("g");
	// pick any number [3-9]
	var numColors = 9;

	ge_rects = element_group.selectAll("g").data(elements)
		.enter()
		.append("g")
		.attr("id",function(d){return "ge_rect"+d.number;})
		.attr("transform", function(d) {
			var x = table_left_margin + (d.column-1)*element_width;
			var y = table_top_margin + (d.row-1)*element_height;
			return "translate("+x+","+y+")";
			})
		.attr("cursor", "pointer")
		.on("mouseover", function(d) {		
			tooltip.transition()		
				 .duration(100)		
				 .style("opacity", .9);		
			tooltip.html(d.name)	
				 .style("left", (d3.event.pageX - 15) + "px")		
				 .style("top", (d3.event.pageY + 15) + "px");	
			})					
		.on("mouseout", function(d) {		
			tooltip.transition()		
				 .duration(200)		
				 .style("opacity", 0);	
			})
		.on('click',function(d) {
			display_element(d,this);
		});

	 rects = ge_rects.append("rect")	
	 .attr("id",function(d){return d.number;})
    .attr("width", element_width)
    .attr("height", element_height)
    .style("stroke", "#333")
    .style("fill", function(d) {
    		if (shade_selection=="no_shading") return default_element_color;
    		else return color_map_value( +d[shade_selection]);
    		});

	var symbols = ge_rects.append("text")	
    .attr("text-anchor", "middle")
    .attr("x", element_width/2)
    .attr("y", element_height/2)
	 .attr("dy", "0.3em") //2020.10.13 Modify 
	 .attr("font-size","125%")
    .text(function(d) {return d.symbol;});

	numbers = ge_rects.append("text")	
    .attr("dy", "1.1em")
    .attr("dx", ".2em")
	 .attr("font-size","75%")
    .text(function(d) {return d.number;});    
    
   //2020.10.13 Add Start---------------------------------
	var hnames = ge_rects.append("text")	
    .attr("dy", "5.2em")
    .attr("dx", ".2em")
	 .attr("font-size","48%")
    //.text(function(d) {return d.hnumber;});    
    .text(function(d){
		 switch(d.number){
			case 1: return "수소"; break;
			case 2: return "헬륨"; break;
			case 3: return "리튬"; break;
			case 4: return "베릴륨"; break;
			case 5: return "붕소"; break;
			case 6: return "탄소"; break;
			case 7: return "질소"; break;
			case 8: return "산소"; break;
			case 9: return "플루오린"; break;
			case 10: return "네온"; break;
			case 11: return "나트륨"; break;
			case 12: return "마그네슘"; break;
			case 13: return "알루미늄"; break;
			case 14: return "규소"; break;
			case 15: return "인"; break;
			case 16: return "황"; break;
			case 17: return "염소"; break;
			case 18: return "아르곤"; break;
			case 19: return "칼륨"; break;
			case 20: return "칼슘"; break;
			case 21: return "스칸듐"; break;
			case 22: return "티타늄"; break;
			case 23: return "바나듐"; break;
			case 24: return "크롬"; break;
			case 25: return "망가니즈"; break;
			case 26: return "철"; break;
			case 27: return "코발트"; break;
			case 28: return "니켈"; break;
			case 29: return "구리"; break;
			case 30: return "아연"; break;
			case 31: return "갈륨"; break;
			case 32: return "게르마늄"; break;
			case 33: return "비소"; break;
			case 34: return "셀레늄"; break;
			case 35: return "브로민"; break;
			case 36: return "크립톤"; break;
			case 37: return "루비듐"; break;
			case 38: return "스트론튬"; break;
			case 39: return "이트륨"; break;
			case 40: return "지르코늄"; break;
			case 41: return "나이오븀"; break;
			case 42: return "몰리브데넘"; break;
			case 43: return "테크네튬"; break;
			case 44: return "루테늄"; break;
			case 45: return "로듐"; break;
			case 46: return "팔라듐"; break;
			case 47: return "은"; break;
			case 48: return "카드뮴"; break;
			case 49: return "인듐"; break;
			case 50: return "주석"; break;
			case 51: return "안티모니"; break;
			case 52: return "텔루륨"; break;
			case 53: return "아이오딘"; break;
			case 54: return "제논"; break;
			case 55: return "세슘"; break;
			case 56: return "바륨"; break;
			case 57: return "란타넘"; break;
			case 58: return "세륨"; break;
			case 59: return "프라세오디뮴"; break;
			case 60: return "네오디뮴"; break;
			case 61: return "프로메튬"; break;
			case 62: return "사마륨"; break;
			case 63: return "유로폼"; break;
			case 64: return "가돌리늄"; break;
			case 65: return "터븀"; break;
			case 66: return "디스프로슘"; break;
			case 67: return "홀뮴"; break;
			case 68: return "어븀"; break;
			case 69: return "툴륨"; break;
			case 70: return "이터븀"; break;
			case 71: return "루테튬"; break;
			case 72: return "하프늄"; break;
			case 73: return "탄탈럼"; break;
			case 74: return "텅스텐"; break;
			case 75: return "레늄"; break;
			case 76: return "오스뮴"; break;
			case 77: return "이리듐"; break;
			case 78: return "백금"; break;
			case 79: return "금"; break;
			case 80: return "수은"; break;
			case 81: return "탈륨"; break;
			case 82: return "납"; break;
			case 83: return "비스무트"; break;
			case 84: return "폴로늄"; break;
			case 85: return "아스타틴"; break;
			case 86: return "라돈"; break;
			case 87: return "프랑슘"; break;
			case 88: return "라듐"; break;
			case 89: return "악티늄"; break;
			case 90: return "토륨"; break;
			case 91: return "프로트악티늄"; break;
			case 92: return "우라늄"; break;
			case 93: return "넵투늄"; break;
			case 94: return "플로토늄"; break;
			case 95: return "아메리슘"; break;
			case 96: return "퀴륨"; break;
			case 97: return "버클륨"; break;
			case 98: return "캘리포늄"; break;
			case 99: return "아인슈타이늄"; break;
			case 100: return "페르뮴"; break;
			case 101: return "멘델레븀"; break;
			case 102: return "노벨륨"; break;
			case 103: return "로렌슘"; break;
			case 104: return "러더포듐"; break;
			case 105: return "더브늄"; break;
			case 106: return "시보귬"; break;
			case 107: return "보륨"; break;
			case 108: return "하슘"; break;
			case 109: return "마이트너륨"; break;
			case 110: return "다름슈타튬"; break;
			case 111: return "뢴트게늄"; break;
			case 112: return "코페르니슘"; break;
			case 113: return "니호늄"; break;
			case 114: return "플레로븀"; break;
			case 115: return "모스코븀"; break;
			case 116: return "리버모륨"; break;
			case 117: return "테네신"; break;
			case 118: return "오가네손"; break;
			//...
			default : return "";
		}; //문법 참고: https://blueice0414.tistory.com/49
    });
   //2020.10.13 Add End---------------------------------

	set_table_legend();
    
  function clear_display(){
  		symbol_text.text("");
  		name_text.text("");
  		symbol_text.text("");
  }  
  
	function solve_puzzle(puzzle_number, stroke_color, stroke_width, duration, cursor){
		$.each(families[puzzle_number], function(index, value){
			var element_unit = d3.select("#ge_rect"+value);
			element_unit
				.transition()
				.duration(duration)
				.attr("transform", function(d) {
					var x = table_left_margin + (d.column-1)*element_width ;
					var y = table_top_margin  + (d.row   -1)*element_height;
					return "translate("+x+","+y+")";
				});
			element_unit
				.on(".drag", null)
				.attr("cursor", cursor);
			element_unit.select("rect")
				.style("stroke", stroke_color)
				.style("stroke-width", stroke_width);
		});
	}  
  
	function reverse_color(original_color){
		var r,g,b;
		if (original_color.charAt(0) == 'r') {
			var trimmed_color = original_color.substr(4,original_color.length-5);
			trimmed_color = trimmed_color.replace(/ /g,'');	
			var rgb = trimmed_color.split(",");
			r = rgb[0];
			g = rgb[1];
			b = rgb[2];
		}	
		if (original_color.charAt(0) == '#') {
			r = parseInt(original_color.substring(1,3),16);
			g = parseInt(original_color.substring(3,5),16);
			b = parseInt(original_color.substring(5,7),16);
		}	
		var return_color = rgbToHex(contrast_component(r),contrast_component(g),contrast_component(b));
		return return_color;
	}
	
	function contrast_component(c){
		if (c < 64 || c > 192) return 255-c;
		else if (c > 128 ) return c - 128;
		else return 255 - ( c - 128);
	}

	function rgbToHex(r, g, b) {
		// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		var rgb = b | (g << 8) | (r << 16);
		return '#' + (0x1000000 + rgb).toString(16).slice(1);
	}  
	
	function display_shading_legend(shade_option){
		clear_shade_legend();
		if (shade_option != "no_shading") {
			var shade_legend = "Shading: "+properties[shade_option].name;
			shade_text.text(shade_legend);
		}
	
	}
	function clear_shade_legend(){
		if(typeof shade_text != "undefined") {
			shade_text.text("");
		}
  }
  
  function set_table_legend(){
  	clear_shade_legend();
//  	shade_text.text("Periodic Puzzle");
  }
  
  function no_display_element(){
		if (displayed_element != 0){
			$("#"+displayed_element).css({"stroke": "#333"});
			$("#"+displayed_element).css({"stroke-width": 1});
			symbol_text.text("");
			name_text.text("");
			property_text.text("");
		}
  }
  
  function display_element(element, that){ 
  
		if (puzzle_selection == "no_puzzle") { 
			if (displayed_element != 0){
				$("#"+displayed_element).css({"stroke": "#333"});
				$("#"+displayed_element).css({"stroke-width": 1});
			}
			d3.select(that).moveToFront();
			displayed_element = element.number  
			clear_display();
			var fill = $("#"+element.number).css("fill");
			var new_fill = reverse_color(fill);	
		
	//		$("#"+element.number).css({"stroke": "#3CC"});
			$("#"+element.number).css({"stroke": new_fill});
			$("#"+element.number).css({"stroke-width": 3});
		
			symbol_text.text(element.symbol);
			name_text.text(element.number+"  "+element.name);
		
			if (shade_selection != "no_shading") {
				property_text.text(properties[shade_selection].name + ": "+element[shade_selection]+" "+properties[shade_selection].units);
			}

			var element_info_div = $("#element_info");
			var element_info_text = "<li style='padding:0 1em 0 0.5em;'>"+element.symbol+" &nbsp "+element.name+"</li>"
	//  		element_info_text += "<li style='padding:0 1em 0 0.5em;'>"+element.name+"</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>atomic number  &nbsp;"+element.number+"</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>atomic mass   &nbsp;"+element.mass+"</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>m.p.   &nbsp;"+element.melting_point+"&deg;C</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'> b.p.   &nbsp;"+element.boiling_point+"&deg;C</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>electron config   &nbsp;"+element.electron_config+"</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>ionization energy   &nbsp;"+element.ionization_energy+" kJ/mol</li>";
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>electron affinity   &nbsp;"+element.electron_affinity+" kJ/mol</li>";
			
			if (element.oxide != " ") {
				var oxides = element.oxide.split(",");
				element_info_text += "<li style='padding:0 1em 0 0.5em;'>oxide   &nbsp;";
				for (var ox = 0; ox < oxides.length; ox++){
					o_sub = oxides[ox];
					e_sub = "";
					if (oxides[ox] == '1') o_sub = "";
					else if (oxides[ox] == '0.5'){
						e_sub = 2;
						o_sub = "";
					}
					else if (oxides[ox] == '1.5'){
						e_sub = 2;
						o_sub = 3;
					}
					else if (oxides[ox] == '2.5'){
						e_sub = 2;
						o_sub = 5;
					}
					else if (oxides[ox] == '3.5'){
						e_sub = 2;
						o_sub = 7;
					}
					if (ox > 0) element_info_text += "&nbsp;&nbsp;";
					element_info_text += element.symbol+"<sub>"+e_sub+"</sub>O<sub>"+o_sub+"</sub>";
				}
				element_info_text += "</li>";
			}
			if (element.halide != " ") {
				var halides = element.halide.split(",");
				element_info_text += "<li style='padding:0 1em 0 0.5em;'>halide   &nbsp;";
				for (var hx = 0; hx < halides.length; hx++){
					x_sub = halides[hx];
					e_sub = "";
					if (halides[hx] == '1') x_sub = "";
					else if (halides[hx] == '0.5'){
						e_sub = 2;
						x_sub = "";
					}
					else if (halides[hx] == '1.5'){
						e_sub = 2;
						x_sub = 3;
					}
					else if (halides[hx] == '2.5'){
						e_sub = 2;
						x_sub = 5;
					}
					else if (halides[hx] == '3.5'){
						e_sub = 2;
						x_sub = 7;
					}
					if (hx > 0) element_info_text += "&nbsp;&nbsp;";
					element_info_text += element.symbol+"<sub>"+e_sub+"</sub>X<sub>"+x_sub+"</sub>";
				}
				element_info_text += "</li>";
			}
			element_info_text += "<li style='padding:0 1em 0 0.5em;'>";
			if (element.metal == "1") {
				element_info_text += "metal";
			}
			else if (element.metal == "0.5") {
				element_info_text += "metalloid";
			}
			else element_info_text += "non-metal";
			element_info_text += "</li>";


			element_info_div.html(element_info_text);
		} else {
			element_to_solve = element.number;
		}
  }
      
	function color_map_value(value){
		if (value == " ") return default_element_color;
		else return heatmapColour(value);
	}    

function dragmove(d) {
	//http://bl.ocks.org/mbostock/1557377
	//https://groups.google.com/forum/#!topic/d3-js/IccJrim32Mc
	var dx = d3.event.dx;
   var dy = d3.event.dy;
	var split = d3.select(this).attr("transform").split(",");
	var x = ~~split[0].split("(")[1];
	var y = ~~split[1].split(")")[0];
	d3.select(this).attr("transform", "translate(" + (x + dx) + "," + (y + dy)+ ")");
   }
 
// http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2 
	d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
