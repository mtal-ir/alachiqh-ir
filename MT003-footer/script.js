// JS===============================================================================================
//                                            دکمه پرش اسکرول نرم به بالای سایت               
// =============================================================================================MTAL

document.addEventListener('DOMContentLoaded', function() {
    const scrollBtns = document.querySelectorAll('.scroll-top-btn');
    const hideOnScrollElements = document.querySelectorAll('.hide-on-scroll');
    const moveElements = document.querySelectorAll('.move-element'); // حفظ‌شده برای سایر المان‌ها
    
    let lastScrollTop = 0;
    let isAtFooterEnd = false; // پرچم برای تشخیص رسیدن به انتهای فوتر

    // ۱. رویداد کلیک دکمه
    if (scrollBtns.length > 0) {
        scrollBtns.forEach(function(scrollBtn) {
            scrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // اگر دکمه چرخانده شده باشد یا به انتهای فوتر رسیده باشیم، با کلیک به بالا می‌رود
                if (scrollBtn.classList.contains('show-btn') || isAtFooterEnd) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // در غیر این صورت به پایین‌ترین نقطه سایت هدایت می‌شود
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            });
        });
    }

    // ۲. رصد کردن دقیق ویجت تیتر آخر با کلاس footer-end-trigger
    const footerTriggerElement = document.querySelector('.footer-end-trigger');
    
    if (footerTriggerElement) {
        const observerOptions = {
            root: null,
            threshold: 0.05 // به محض اینکه ۵ درصد از این ویجت تیتر وارد کادر دید کاربر شود
        };

        const footerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                isAtFooterEnd = entry.isIntersecting;
                
                scrollBtns.forEach(btn => {
                    if (isAtFooterEnd) {
                        btn.classList.add('show-btn'); // چرخش ۱۸۰ درجه آیکن
                    } else if (window.pageYOffset <= 100) {
                        btn.classList.remove('show-btn'); // حالت عادی در بالای صفحه
                    }
                });
            });
        }, observerOptions);

        footerObserver.observe(footerTriggerElement);
    }

    // ۳. مدیریت اسکرول صفحه
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll < 0) return;

        // محاسبه درصد پیشرفت اسکرول صفحه (بین 0 تا 100) برای نوار دایره‌ای دور دکمه
        let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrollPercent = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;

        // اعمال درصد پیشرفت و مدیریت چرخش به دکمه‌های پرش به بالا
        scrollBtns.forEach(function(btn) {
            btn.style.setProperty('--scroll-progress', scrollPercent);

            if (!isAtFooterEnd) {
                if (currentScroll < lastScrollTop && currentScroll > 100) {
                    btn.classList.add('show-btn');
                } else if (currentScroll > lastScrollTop && currentScroll > 100) {
                    btn.classList.remove('show-btn');
                }
            }
            
            if (currentScroll <= 50) {
                btn.classList.remove('show-btn');
            }
        });

       // ب) مدیریت باتم‌بار (.hide-on-scroll) کاملاً هماهنگ با scrollBtns
        hideOnScrollElements.forEach(function(bar) {
            let scrollDelta = currentScroll - lastScrollTop;

            // اگر کاربر به سمت پایین اسکرول کرد و از بالای صفحه عبور کرده بود
            if (scrollDelta > 1 && currentScroll > 100) {
                bar.classList.add('hide-bar');
            } 
            // اگر کاربر به سمت بالا اسکرول کرد یا به ابتدای صفحه برگشت
            else if (scrollDelta < -1 || currentScroll <= 50) {
                bar.classList.remove('hide-bar');
            }
        });
        // ج) مدیریت المان‌های .move-element (حفظ‌شده برای سایر بخش‌های سایت)
        if (currentScroll > lastScrollTop) {
            moveElements.forEach(el => el.classList.add('move-down'));
        } else {
            moveElements.forEach(el => el.classList.remove('move-down'));
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});
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
