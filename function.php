<?php
/**
 * Theme functions and definitions.
 *
 * For additional information on potential customization options,
 * read the developers' documentation:
 *
 * https://developers.elementor.com/docs/hello-elementor-theme/
 *
 * @package HelloElementorChild
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_CHILD_VERSION', '2.0.0' );

/**
 * Load child theme scripts & styles.
 *
 * @return void
 */
function hello_elementor_child_scripts_styles() {

	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		[
			'hello-elementor-theme-style',
		],
		HELLO_ELEMENTOR_CHILD_VERSION
	);

}
add_action( 'wp_enqueue_scripts', 'hello_elementor_child_scripts_styles', 20 );


//----------------------------------------------------start-------------------------------------------------//
require(__dir__ . '/loginwp/mtallogin.php');
require(__dir__ . '/MT001-entire-site/PHP.php');
require(__dir__ . '/MT002-header/PHP.php');
require(__dir__ . '/MT003-footer/PHP.php');
require(__dir__ . '/MT004-home/PHP.php');
require(__dir__ . '/MT005-suites/PHP.php');
require(__dir__ . '/MT006-suits-archive/PHP.php');
require(__dir__ . '/MT007-resume/PHP.php');
require(__dir__ . '/MT008-account/PHP.php');
require(__dir__ . '/MT009-checkout/PHP.php');
require(__dir__ . '/MT010-cart/PHP.php');
require(__dir__ . '/MT011-aftercheckout/PHP.php');
require(__dir__ . '/MT012-library/PHP.php');
require(__dir__ . '/MT013-speed/PHP.php');
require(__dir__ . '/MT014-blog/PHP.php');
require(__dir__ . '/MT015-archiveblog/PHP.php');
//----------------------------------------------------اتصال به فرم تاریخ شمسی المنتورفا-------------------------------------------------//
add_action('wp_enqueue_scripts', 'mtal_override_elementorfa_datepicker', 20);
add_action('elementor/editor/after_enqueue_scripts', 'mtal_override_elementorfa_datepicker', 20);

function mtal_override_elementorfa_datepicker() {
    // لغو اسکریپت‌های پیش‌فرض المنتورفا
    wp_deregister_script('persian-elementor-datepicker');
    wp_deregister_script('persian-elementor-datepicker-init');

    $version = '1.2.7';
    $base_url = get_stylesheet_directory_uri() . '/persian-datepicker/assets/';

    // ثبت و بارگذاری فایل‌های ماژولار و سفارشی شما
    wp_register_script(
        'persian-elementor-datepicker',
        $base_url . 'js/persian-calendar-standalone.js',
        [],
        $version,
        true
    );

    wp_register_script(
        'persian-elementor-datepicker-init',
        $base_url . 'js/datepicker-init.js',
        ['persian-elementor-datepicker', 'jquery'],
        $version,
        true
    );

    wp_enqueue_script('persian-elementor-datepicker');
    wp_enqueue_script('persian-elementor-datepicker-init');
}
