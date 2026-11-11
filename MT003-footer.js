
<script src="https://a.alachiqh.ir//wp-content/themes/mohammad-talebi-child-theme/MT003-footer/script.js"></script>




// MTAL=============================================================================================
//                                            کارت مشخصات حرفه‌ای
// ===============================================================================================JS
/**********javascript code**********/
const nschaticon = document.querySelector(".nschaticon");
const nschatbox = document.querySelector(".nschatbox");

nschaticon.addEventListener("click" , function(){
nschaticon.classList.toggle("active");
nschatbox.classList.toggle("active");

});

// JS===============================================================================================
//                                       باتم بار موبایل تشخیص صفحه               
// =============================================================================================MTAL
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll(".elementor-icon a, a.elementor-icon");
    const currentUrl = window.location.href.replace(/\/$/, ""); // حذف اسلش آخر برای تطابق بهتر

    links.forEach((link) => {
        const linkUrl = link.href.replace(/\/$/, "");

        // بررسی تطابق دقیق آدرس صفحه با لینک
        if (linkUrl === currentUrl) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});
// JS===============================================================================================
//                                            دکمه پرش اسکرول نرم به بالای سایت               
// =============================================================================================MTAL
/*
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scroll-top-btn');
    let lastScrollTop = 0;

    if (scrollBtn) {
        // کلیک برای اسکرول نرم به بالای صفحه
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // تشخیص جهت اسکرول
        window.addEventListener('scroll', function() {
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > 200) {
                // اسکرول به سمت پایین -> پنهان شدن دکمه
                scrollBtn.classList.remove('show-btn');
            } else if (currentScroll < lastScrollTop) {
                // اسکرول به سمت بالا -> ظاهر شدن دکمه
                scrollBtn.classList.add('show-btn');
            }

            // اگر کاربر به ابتدای صفحه نزدیک بود، دکمه کلاً مخفی بماند
            if (currentScroll <= 100) {
                scrollBtn.classList.remove('show-btn');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    }
	});
*/
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtns = document.querySelectorAll('.scroll-top-btn');
    const hideOnScrollElements = document.querySelectorAll('.hide-on-scroll');
    const moveElements = document.querySelectorAll('.move-element');
    
    let lastScrollTop = 0;

    // ۱. رویداد کلیک برای دکمه‌های بازگشت به بالا
    if (scrollBtns.length > 0) {
        scrollBtns.forEach(function(scrollBtn) {
            scrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // ۲. مدیریت اسکرول برای باتم‌بار، دکمه پرش به بالا و المان‌های حرکتی
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll < 0) return;

        // الف) مدیریت دکمه پرش به بالا (مانند قبل با کلاس و ترنزیشن)
        scrollBtns.forEach(function(btn) {
            if (currentScroll > lastScrollTop && currentScroll > 200) {
                btn.classList.remove('show-btn');
            } else if (currentScroll < lastScrollTop) {
                btn.classList.add('show-btn');
            }
            if (currentScroll <= 100) {
                btn.classList.remove('show-btn');
            }
        });

        // ب) حرکت پیکسل‌به‌پیکسل و کاملاً همگام باتم‌بار (.hide-on-scroll)
        // محاسبه میزان جابجایی نسبت به آخرین اسکرول
        hideOnScrollElements.forEach(function(bar) {
            // دریافت مقدار فعلی translateY یا تنظیم مقدار اولیه
            let currentTransformY = bar.style.transform ? parseInt(bar.style.transform.replace(/[^-\d.]/g, '')) || 0 : 0;
            
            // اگر به سمت پایین اسکرول می‌کنیم، باتم‌بار به پایین هدایت شود (حداکثر تا ارتفاع خودش مثلا 100px)
            // و اگر به سمت بالا اسکرول می‌کنیم، به جایگاه اصلی برگردد (0px)
            let scrollDelta = currentScroll - lastScrollTop;
            let newTransformY = currentTransformY + scrollDelta;

            // محدود کردن جابجایی بین 0 (حالت عادی) و 80 یا 100 پیکسل (مخفی شدن کامل در پایین)
            // (می‌توانید عدد 80 را بسته به ارتفاع باتم‌بار خودتان تغییر دهید)
            newTransformY = Math.max(0, Math.min(newTransformY, 80));

            bar.style.transform = `translateY(${newTransformY}px)`;
            
            // مدیریت شفافیت همزمان با جابجایی پیکسل‌به‌پیکسل
            bar.style.opacity = 1 - (newTransformY / 80);
            bar.style.visibility = newTransformY >= 80 ? 'hidden' : 'visible';
        });

        // ج) مدیریت المان‌های .move-element (کد قبلی شما)
        if (currentScroll > lastScrollTop) {
            moveElements.forEach(el => el.classList.add('move-down'));
        } else {
            moveElements.forEach(el => el.classList.remove('move-down'));
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});