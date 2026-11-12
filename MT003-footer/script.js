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

        // ب) مدیریت باتم‌بار (.hide-on-scroll)
        hideOnScrollElements.forEach(function(bar) {
            let currentTransformY = bar.style.transform ? parseInt(bar.style.transform.replace(/[^-\d.]/g, '')) || 0 : 0;
            let scrollDelta = currentScroll - lastScrollTop;
            let newTransformY = currentTransformY + scrollDelta;

            newTransformY = Math.max(0, Math.min(newTransformY, 80));

            bar.style.transform = `translateY(${newTransformY}px)`;
            bar.style.opacity = 1 - (newTransformY / 80);
            bar.style.visibility = newTransformY >= 80 ? 'hidden' : 'visible';
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
// JS===============================================================================================
//                                            دکمه پرش اسکرول نرم به بالای سایت               
// =============================================================================================MTAL

document.addEventListener('DOMContentLoaded', function() {
    const scrollBtns = document.querySelectorAll('.scroll-top-btn');
    const hideOnScrollElements = document.querySelectorAll('.hide-on-scroll');
    const moveElements = document.querySelectorAll('.move-element');
    
    let lastScrollTop = 0;

    // ۱. رویداد کلیک دکمه بر اساس جهت فعلی فلش (کلاس show-btn)
    if (scrollBtns.length > 0) {
        scrollBtns.forEach(function(scrollBtn) {
            scrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // اگر دکمه رو به بالا باشد (کلاس show-btn را داشته باشد)، با کلیک به بالای صفحه می‌رود
                if (scrollBtn.classList.contains('show-btn')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // اگر دکمه رو به پایین باشد، با کلیک به پایین‌ترین نقطه صفحه هدایت می‌شود
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            });
        });
    }

    // ۲. مدیریت اسکرول صفحه (تغییر جهت خودکار فلش بر اساس اسکرول و رسیدن به انتها)
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll < 0) return;

        // محاسبه اینکه آیا کاربر به انتهای صفحه (فوتر) رسیده است یا خیر
        const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50;

        // الف) مدیریت جهت دکمه (کلاس show-btn برای چرخش ۱۸۰ درجه)
        scrollBtns.forEach(function(btn) {
            // اگر کاربر به انتهای صفحه رسیده باشد یا در حال اسکرول به سمت بالا باشد، فلش رو به بالا می‌چرخد
            if (isAtBottom || (currentScroll < lastScrollTop && currentScroll > 100)) {
                btn.classList.add('show-btn');
            } 
            // اگر کاربر به سمت پایین اسکرول کند و در بالای صفحه/وسط صفحه باشد، فلش رو به پایین قرار می‌گیرد
            else if (currentScroll > lastScrollTop && currentScroll > 100) {
                btn.classList.remove('show-btn');
            }
            // در صورتی که خیلی نزدیک به بالای صفحه باشیم، حالت پیش‌فرض (رو به پایین) فعال می‌شود
            if (currentScroll <= 50) {
                btn.classList.remove('show-btn');
            }
        });

        // ب) مدیریت باتم‌بار (.hide-on-scroll)
        hideOnScrollElements.forEach(function(bar) {
            let currentTransformY = bar.style.transform ? parseInt(bar.style.transform.replace(/[^-\d.]/g, '')) || 0 : 0;
            
            let scrollDelta = currentScroll - lastScrollTop;
            let newTransformY = currentTransformY + scrollDelta;

            newTransformY = Math.max(0, Math.min(newTransformY, 80));

            bar.style.transform = `translateY(${newTransformY}px)`;
            bar.style.opacity = 1 - (newTransformY / 80);
            bar.style.visibility = newTransformY >= 80 ? 'hidden' : 'visible';
        });

        // ج) مدیریت المان‌های .move-element
        if (currentScroll > lastScrollTop) {
            moveElements.forEach(el => el.classList.add('move-down'));
        } else {
            moveElements.forEach(el => el.classList.remove('move-down'));
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});