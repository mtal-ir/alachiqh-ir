<?php
// PHP==============================================================================================
//                                                                 
// =============================================================================================MTAL

define('MTALLOGIN' , get_stylesheet_directory_uri().'/loginwp/');
function mtallstyle(){
	echo'
	<link rel="stylesheet" href="'.MTALLOGIN.'mtalloginstyle.css">
	';	
}
add_action('login_header' , 'mtallstyle');
function mtalscriptlogin(){
	echo'
	<script src="'.MTALLOGIN.'mtalloginscript.js"></script>
	';
	}
	add_action('login_footer' , 'mtalscriptlogin');