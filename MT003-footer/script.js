// JS===============================================================================================
//                                            دکمه پرش اسکرول نرم به بالای سایت               
// =============================================================================================MTAL

// MTAL - Fully Synchronized & Highly Sensitive Scroll Script for Mobile & Desktop
document.addEventListener('DOMContentLoaded', function () {
    const headerNav = document.getElementById('headernav');
    const scrollBtns = document.querySelectorAll('.scroll-top-btn');
    const hideOnScrollElements = document.querySelectorAll('.hide-on-scroll');
    const moveElements = document.querySelectorAll('.move-element');
    const footerTriggerElement = document.querySelector('.footer-end-trigger');

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let isAtFooterEnd = false;
    let ticking = false;
    const startsFromTop = 50; // کاهش آستانه برای واکنش سریع‌تر در بالای صفحه

    // ۱. مدیریت IntersectionObserver فوتر برای دکمه
    if (footerTriggerElement) {
        const footerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                isAtFooterEnd = entry.isIntersecting;
                scrollBtns.forEach(btn => {
                    if (isAtFooterEnd) {
                        btn.classList.add('show-btn');
                    } else if ((window.pageYOffset || document.documentElement.scrollTop) <= startsFromTop) {
                        btn.classList.remove('show-btn');
                    }
                });
            });
        }, { root: null, threshold: 0.05 });

        footerObserver.observe(footerTriggerElement);
    }

    // ۲. رویداد کلیک دکمه‌های پرش به بالا/پایین
    if (scrollBtns.length > 0) {
        scrollBtns.forEach(function (scrollBtn) {
            scrollBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (scrollBtn.classList.contains('show-btn') || isAtFooterEnd) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            });
        });
    }

    // ۳. مدیریت یکپارچه اسکرول با حساسیت بالا برای موبایل
    window.addEventListener('scroll', function () {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll < 0) return;

        if (!ticking) {
            window.requestAnimationFrame(function () {
                let scrollDelta = currentScroll - lastScrollTop;
                let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                let scrollPercent = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;

                // کاهش حساسیت به 0.5 برای درک اسکرول‌های بسیار آهسته روی موبایل
                const sensitivity = 0.5;

                // الف) کنترل هدر (پنهان شدن به بالا)
                if (headerNav) {
                    if (currentScroll > startsFromTop) {
                        if (scrollDelta > sensitivity) {
                            headerNav.classList.add('headerup');
                            document.body.classList.add('header-is-up');
                        } else if (scrollDelta < -sensitivity) {
                            headerNav.classList.remove('headerup');
                            document.body.classList.remove('header-is-up');
                        }
                    } else {
                        headerNav.classList.remove('headerup');
                        document.body.classList.remove('header-is-up');
                    }
                }

                // ب) کنترل باتم‌بار و المان‌های .hide-on-scroll (مخفی شدن هماهنگ)
                hideOnScrollElements.forEach(function (bar) {
                    if (scrollDelta > sensitivity && currentScroll > startsFromTop) {
                        bar.classList.add('hide-bar');
                    } else if (scrollDelta < -sensitivity || currentScroll <= 30) {
                        bar.classList.remove('hide-bar');
                    }
                });

                // ج) کنترل دکمه اسکرول و درصد دایره‌ای
                scrollBtns.forEach(function (btn) {
                    btn.style.setProperty('--scroll-progress', scrollPercent);

                    if (!isAtFooterEnd) {
                        if (currentScroll < lastScrollTop && currentScroll > startsFromTop) {
                            btn.classList.add('show-btn');
                        } else if (currentScroll > lastScrollTop && currentScroll > startsFromTop) {
                            btn.classList.remove('show-btn');
                        }
                    }
                    if (currentScroll <= 30) {
                        btn.classList.remove('show-btn');
                    }
                });

                // د) کنترل المان‌های .move-element
                if (scrollDelta > sensitivity) {
                    moveElements.forEach(el => el.classList.add('move-down'));
                } else if (scrollDelta < -sensitivity) {
                    moveElements.forEach(el => el.classList.remove('move-down'));
                }

                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ۴. تطابق URL برای منو و باتم‌بار
    const currentUrl = window.location.href.replace(/\/$/, "");
    
    const bottomBarLinks = document.querySelectorAll(".elementor-icon a, a.elementor-icon");
    bottomBarLinks.forEach((link) => {
        if (link.href) {
            const linkUrl = link.href.replace(/\/$/, "");
            if (linkUrl === currentUrl) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        }
    });

    const headerMenuLinks = document.querySelectorAll('a.elementor-icon-list-item, .elementor-icon-list-item a');
    headerMenuLinks.forEach(link => {
        if (link.href) {
            const linkUrl = link.href.replace(/\/$/, "");
            if (linkUrl === currentUrl) {
                const listItem = link.closest('.elementor-icon-list-item');
                if (listItem) {
                    listItem.classList.add('urlactive');
                }
            }
        }
    });
});
// ۵. مدیریت کلیک روی لینک‌های لنگر (#) برای اسکرول نرم و دقیق با در نظر گرفتن ارتفاع هدر
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // اگر لینک فقط یک '#' خالی بود، کاری نکنیم
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // جلوگیری از رفتار پیش‌فرض پرش ناگهانی

                // محاسبه ارتفاع هدر برای اینکه المان زیر هدر پنهان نشود
                const headerNav = document.getElementById('headernav');
                const headerHeight = headerNav ? headerNav.offsetHeight : 0;
                
                // فاصله المان تا بالای صفحه منهای ارتفاع هدر (و کمی فضای خالی اضافی)
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
// MTAL=============================================================================================
//                                            کارت مشخصات حرفه‌ای
// ===============================================================================================JS
const mtalaticon = document.querySelector(".mtalaticon");
const mtalatbox = document.querySelector(".mtalatbox");

// تابع مشترک برای بستن چت‌باکس
function closeChatbox() {
    if (mtalatbox.classList.contains("active")) {
        mtalaticon.classList.remove("active");
        mtalatbox.classList.remove("active");
    }
}

// باز و بسته کردن با کلیک روی آیکون
mtalaticon.addEventListener("click", function(event) {
    event.stopPropagation(); // جلوگیری از بسته شدن فوری توسط سند
    mtalaticon.classList.toggle("active");
    mtalatbox.classList.toggle("active");
});

// جلوگیری از بسته شدن چت‌باکس وقتی کاربر روی خود گزینه‌های داخل آن کلیک می‌کند
mtalatbox.addEventListener("click", function(event) {
    event.stopPropagation();
});

// بسته شدن کانتینر با کلیک در هر جای دیگر صفحه
document.addEventListener("click", function() {
    closeChatbox();
});

// بسته شدن چت‌باکس به محض اسکرول کردن صفحه (بالا یا پایین)
window.addEventListener("scroll", function() {
    closeChatbox();
});

// JS===============================================================================================
//                                       باتم بار موبایل تشخیص صفحه               
// =============================================================================================MTAL

