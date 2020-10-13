// JavaScript Document

var menu_array = [
	{name:'<h2 style="margin-left:-0.5em; margin-top:-0.5em;">bpReid</h2>',   type: 'link',    link:'index.html'},
	{name:'General Chemistry', type: 'heading', link:''},
	{name:'Periodic Puzzle',   type: 'link',    link:'periodic_puzzle.html'},

	{name:'Electrons in Atoms', type: 'link',   link:'1_theamusementparkrideatom.html'},
	{name:'The Periodic Table', type: 'link',   link:'2_theperiodictable.html'},
	{name:'Bonding',            type: 'link',   link:'3_bonding.html'},
	{name:'<hr />',       type: 'heading',   link:''},
	{name:'About BPReid',       type: 'link',   link:'about.html'}
	];


var footer = 'Copyright &copy;2018 Brian P. Reid &#183; bpreid.com &#183; <a href="about.html">Privacy Policy</a>';


var bpr;
bpr = '&#98;&#114;&#46;&#112;&#46;&#114;&#101;&#105;&#100;';
bpr = bpr + '&#64;&#118;&#97;&#108;&#108;&#101;&#121;&#46;&#110;&#101;&#116;';

var header = '<h1 id="header">Software for Science and Mathematics</h1>';

var menu = '              <ul style="list-style:none;"> ';
	menu += '<li id="home"><a href="index.html"><h1>bpReid</h1></a></li> ';
// 	menu += '                    <hr />';
	menu += '<li>General Chemistry</li>';
	menu += '<li id = "periodic"   class="listindent"> <a href="periodic.html">Periodic Puzzle</a>      </li>';
	menu += '<li id = "periodique" class="listindent"> <a href="periodique.php">Puzzle PÈriodique</a>  </li>';
	menu += '<li id = "vsepr"      class="listindent"> <a href="vsepr.php">Molecular Shapes - VSEPR</a></li> ';       
	menu += '<li id = "qualitative">                   <a href="qual.php">Qualitative Analysis</a>     </li>';
	menu += '<li id = "anions"     class="listindent"> <a href="anions.php">Anions</a>                 </li>';
	menu += '<li id = "cations"    class="listindent"> <a href="cations.php">Cations</a>               </li>';
	menu += '<li id = "redox"      class="listindent"> <a href="redox.php">Redox Puzzle</a>            </li>';
	menu += '<li>Quantum Mechanics</li>';
	menu += '<li id = "poas" class="listindent"><a href="poas.php">Particle on a Sphere</a></li>';
	menu += '<li id = "square" class="listindent"><a href="square.php">Particle in a Square</a></li>';
	menu += '<li id = "waves" class="listindent"><a href="waves.php">Wave Superposition</a></li>';
// 	menu += '<hr />';
	menu += '<li>Spectroscopy</li>';
	menu += '<li id="eiab" class="listindent"><a href="eiab.php">Conjugated Dye</a></li>';
	menu += '<li id="mas" class="listindent"><a href="mas.php">Meterstick Spectroscopy</a></li>';
	menu += '<li id="hel" class="listindent"><a href="hel.php">Hydrogen Energy Levels</a></li>';
	menu += '<li id="spectral" class="listindent"><a href="spectral.php">Spectral Colors</a></li>';
                    
	menu += '<hr />';
	menu += '<li>Thermodynamics</li>	';			
	menu += '<li id="carnot" class="listindent"><a href="carnot.php">Carnot Cycle</a></li>';
	menu += '<li id="pv" class="listindent"><a href="pv.php">P-V Isotherms</a></li>';
	menu += '<li id="hess" class="listindent"><a href="deltaH.php">Hess\'s Law</a></li>';
	menu += '<hr />';
	menu += '<li>Data Analysis - Modeling</li>';
	menu += '<li id="linear" class="listindent"><a href="linear.php">Linear Plot</a></li>';
	menu += '<li id="kinetics" class="listindent"><a href="kinetics.php">Kinetics Plot</a></li>';
	menu += '<li id="yapap" class="listindent"><a href="yapap.php">YAPAP</a></li>';
	menu += '<li id="bgdem" class="listindent"><a href="bgdem.php">BGDEM</a></li>';
	menu += '<li id="reversible" class="listindent"><a href="reversible.php">Kinetics Modeling</a></li>';
                    
	menu += '<hr />';
	menu += '<li id="diatomic"> <a href="diatomic.php">Diatomic</a> </li>';
	menu += '<li id="classical" class="listindent"><a href="classical.php">Classical Mechanics</a></li>';
	menu += '<li id="quantum" class="listindent"><a href="quantum.php">Quantum Mechanics</a></li>';
	menu += '<li id="statistical" class="listindent"><a href="statistical.php">Statistical Mechanics</a></li>';
                   
	menu += '<hr />';
	menu += '<li>Knowledge Nuggets</li>';
	menu += '<li id ="ride" class="listindent"><a href="1_theamusementparkrideatom.php">Electrons in Atoms</a></li>';
	menu += '<li id ="theperiodic" class="listindent"><a href="2_theperiodictable.php">The Periodic Table</a></li>';
	menu += '<li id ="bonding" class="listindent"><a href="3_bonding.php">Bonding</a></li>';
	menu += '<hr />';
	menu += '<li id="about"><a href="about.php">About BPReid</a></li>';
	menu += '</ul>';

//     			<!--	<li id="order"><a href="order.php">Order from BPReid</a></li> -->


function bprmt(){
	 document.write ('<a href="&#109;&#97;&#105;&#1')
	 document.write ('08;&#116;&#111;&#58;&#98;&#114;&#105;&#97;&#110;&#46;&#114;&#101;&#105;&#100;')
	 document.write ('&#64;')
	 document.write ('&#118;&#97;&#108;&#108;&#101;&#121;')
	 document.write ('&#46;')
	 document.write ('&#110;&#101;&#116;"><font size="2" face="Verdana, Geneva, Arial">')
	 document.write ('&#98;&#114;&#105;&#97;&#110;&#46;&#114;&#101;&#105;&#100;&#32;&#64;&#32;&#118;&#97;&#108;&#108;&#101;&#121;&#46;&#110;&#101;&#116;</font></a>')
	}
	
function business(){
	document.write('<input name="business" value="brian.reid@valley.net" type="hidden">');
	}
	
function verified(){
	document.write('<a href="https://www.paypal.com/us/verified/pal='+bpr+'" target="_blank">');
	}
	
function sendform(){
	document.write('<input name="email" value="'+bpr+'" type="hidden">');
	}
	
	
	