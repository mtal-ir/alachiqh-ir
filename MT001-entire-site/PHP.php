<?php
// MTAL=============================================================================================//
//                                  قالب مودال ها
// ==============================================================================================PHP
add_action('wp_footer', function() {
    // قالب مودال فقط یک بار در فوتر کلان‌سایت رندر می‌شود
    echo '<div id="mtal-global-modal-container">';
    echo do_shortcode('[elementor-template id="1503"]');
    echo '</div>';
});
/* MTAL=============================================================================================
/*                                          پریلودر                          
/* =============================================================================================PHP*/

// ۱. بارگذاری پیش‌دستانه (Preload) تصویر هیروسکشن
add_action( 'wp_head', function() {
    if ( is_front_page() ) {
        echo '<link rel="preload" as="image" href="https://alachiqh.ir/wp-content/uploads/2026/11/home-page-scaled-1.webp" fetchpriority="high">';
    }
});

// ۲. تزریق ساختار HTML پریلودر در ابتدای بدنه سایت
add_action( 'wp_body_open', function() {
    ?>
    <div id="alachigh-preloader">
        <div class="loader-wrapper">
            <div class="loader-ring"></div>
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/Alachiqh-edited-logo-little.png" alt="آلاچیق" class="loader-logo">
        </div>
        <span class="loader-text">در حال آماده‌سازی...</span>
        
        <div class="loader-progress-bar">
            <div class="loader-progress-fill"></div>
        </div>
    </div>
    <?php
});

// ۳. فراخوانی فایل‌های CSS و JS جداگانه مربوط به پریلودر
add_action( 'wp_enqueue_scripts', function() {
    $dir_uri = get_stylesheet_directory_uri() . '/MT001-entire-site/';

    // فراخوانی استایل پریلودر
    wp_enqueue_style( 'mtal-preloader-style', $dir_uri . 'preloader.css', array(), '1.0.0' );

    // فراخوانی اسکریپت پریلودر با تایمر ایمنی
    wp_enqueue_script( 'mtal-preloader-script', $dir_uri . 'preloader.js', array(), '1.0.0', true );
});
/* MTAL=============================================================================================
/*             افزایش زمان انقضای کوکی لاگین وردپرس برای ماندن طولانی‌مدت کاربر در سایت                          
/* =============================================================================================PHP*/

/**
 * افزایش دائمی زمان انقضای نشست وردپرس بدون نیاز به تیک «مرا به خاطر بسپار»
 */
function mtal_permanent_login_expiration($expire_login, $user_id, $remember) {
    // اجبار به افزایش زمان نشست به مدت یک سال (صرف نظر از وضعیت تیک مرا به خاطر بسپار)
    $year_in_seconds = 365 * 24 * 60 * 60;
    return $year_in_seconds;
}
add_filter('auth_cookie_expiration', 'mtal_permanent_login_expiration', 99, 3);
/* MTAL=============================================================================================
/*             مجموعه کدهای امنیت پایه بدون افزونه (MT Security Hardening)                         
/* =============================================================================================PHP*/
// ۱. غیرفعال کردن پروتکل XML-RPC (جلوگیری از حملات Brute Force و DDoS)
add_filter( 'xmlrpc_enabled', '__return_false' );

// ۲. مخفی کردن نسخه وردپرس از سورس صفحات و فیدها
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );

// ۳. مسدود کردن اسکن نام کاربری از طریق آدرس سایت (مثلاً ?author=1)
add_action( 'template_redirect', function() {
    if ( is_author() && ! is_admin() ) {
        wp_redirect( home_url(), 301 );
        exit;
    }
} );
