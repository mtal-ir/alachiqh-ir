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

