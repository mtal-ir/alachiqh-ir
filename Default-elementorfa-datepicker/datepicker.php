<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Persian_Elementor_Datepicker {

    public static function init() {
        add_action('elementor/editor/after_enqueue_scripts', [self::class, 'enqueue_editor_assets']);
    }

    public static function register_assets() {
        $version = PERSIAN_ELEMENTOR_VERSION;

        wp_register_script(
            'persian-elementor-datepicker',
            PERSIAN_ELEMENTOR_URL . 'assets/js/persian-calendar-standalone.js',
            [],
            $version,
            true
        );

        wp_register_script(
            'persian-elementor-datepicker-init',
            PERSIAN_ELEMENTOR_URL . 'assets/js/datepicker-init.js',
            ['persian-elementor-datepicker'],
            $version,
            true
        );
    }

    public static function enqueue_editor_assets() {
        self::register_assets();
        wp_enqueue_script('persian-elementor-datepicker');
        wp_enqueue_script('persian-elementor-datepicker-init');
        wp_add_inline_script('persian-elementor-datepicker-init', 'window.persianElementorDatepickerEnabled = true;', 'before');
    }
}

Persian_Elementor_Datepicker::init();
