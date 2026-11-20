// MTAL=============================================================================================
//                                           تک مودال پویا (Dynamic Single Modal)
// ===============================================================================================JS
document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll(".mtal-open");
    const closeElements = document.querySelectorAll(".mtal-close");
    const modals = document.querySelectorAll(".mtal-front");

    // تابع کمکی برای متوقف کردن ویدیوها هنگام بستن مودال
    function stopVideosInModal(modal) {
        modal.querySelectorAll("video").forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        modal.querySelectorAll("iframe").forEach(iframe => {
            iframe.src = iframe.src;
        });
    }

    // ۱. باز کردن مودال و سوئیچ روی پنل مورد نظر
    openButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const targetPaneName = button.getAttribute("data-target");
            if (!targetPaneName) return;

            // پیدا کردن کارت والد
            const card = button.closest('.jet-listing-grid__item') || button.closest('.elementor-grid-item') || button.closest('.elementor-element') || document;

            // پیدا کردن تنها مودالِ موجود در این کارت
            const modal = card.querySelector('.mtal-front') || document.querySelector('.mtal-front');
            if (!modal) return;

            // پیدا کردن تمام پنل‌های داخل این مودال
            const panes = modal.querySelectorAll('.mtal-pane');
            
            // مخفی کردن همه پنل‌ها و برداشتن اکتیو از آن‌ها
            panes.forEach(pane => {
                pane.classList.remove('active-pane');
            });

            // پیدا کردن و فعال کردن پنل هدف بر اساس data-pane
            const targetPane = modal.querySelector(`[data-pane="${targetPaneName}"]`);
            if (targetPane) {
                targetPane.classList.add('active-pane');
            }

            // باز کردن مودال مادر
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // ۲. بستن مودال با دکمه ضربدر
    closeElements.forEach(element => {
        element.addEventListener("click", () => {
            const modal = element.closest(".mtal-front");
            if (modal) {
                modal.classList.remove("active");
                document.body.style.overflow = ""; 
                stopVideosInModal(modal);
            }
        });
    });

    // ۳. بستن مودال با کلیک روی پس‌زمینه تیره
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            const clickedInsideContent = event.target.closest('.mtal-maxh');
            if (!clickedInsideContent) {
                modal.classList.remove("active");
                document.body.style.overflow = ""; 
                stopVideosInModal(modal);
            }
        });
    });
});
/* MTAL=============================================================================================
/*                                      تول تیپ حرفه ای 
/* ==============================================================================================JS*/
/* MTAL=============================================================================================
/*           class:mtal-tooltip              Attribute:data-tooltip|"..."                           
/* ==============================================================================================JS*/
document.addEventListener("DOMContentLoaded", () => {
    // ایجاد یک المان واحد برای تولتیپ در بدنه صفحه
    const tipElement = document.createElement("div");
    tipElement.className = "mtal-custom-tooltip";
    document.body.appendChild(tipElement);

    const targets = document.querySelectorAll("[data-tooltip]");

    targets.forEach(target => {
        target.addEventListener("mouseenter", (e) => {
            const text = target.getAttribute("data-tooltip");
            if (!text) return;

            tipElement.textContent = text;
            tipElement.style.opacity = "1";
            tipElement.style.visibility = "visible";

            // محاسبه دقیق مختصات المان در صفحه
            const rect = target.getBoundingClientRect();
            const tipRect = tipElement.getBoundingClientRect();

            // قرار دادن کادر دقیقاً در بالای المان و وسط‌چین نسبت به آن
            const topPos = window.scrollY + rect.top - tipRect.height - 8;
            const leftPos = window.scrollX + rect.left + (rect.width / 2) - (tipRect.width / 2);

            tipElement.style.top = `${topPos}px`;
            tipElement.style.left = `${leftPos}px`;
        });

        target.addEventListener("mouseleave", () => {
            tipElement.style.opacity = "0";
            tipElement.style.visibility = "hidden";
        });
    });
});

/* MTAL=============================================================================================
/*                                          ظرفیت تعداد نفرات                          
/* ==============================================================================================JS*/
(function() {
    // ۱. بررسی اولیه: اگر فیلد تعداد نفرات در این صفحه اصلاً وجود ندارد، کلاً متوقف شو
    const initialCheck = document.querySelector('#form-field-mtal_qty, input[name*="mtal_qty"]');
    if (!initialCheck) return; 

    function initMtalQtyControl() {
        const qtyInputs = document.querySelectorAll('#form-field-mtal_qty, input[name*="mtal_qty"]');

        qtyInputs.forEach(qtyInput => {
            const card = qtyInput.closest('.jet-listing-grid__item, .elementor-grid-item, .elementor-element, .post-item') || qtyInput.closest('form');
            const searchContext = card || document.body;
            const suiteLink = searchContext.querySelector('a.mtal-suite-link, a[href*="suite"], .elementor-post__title a, a');
            const cardText = searchContext.innerText || '';

            let urlString = suiteLink ? suiteLink.href : window.location.href;
            let maxLimit = 5; // سقف پیش‌فرض

            // تعیین ظرفیت بر اساس URL یا متن داخل کارت
            if (urlString.includes('suite-one') || urlString.includes('suite-two') || cardText.includes('سوئیت ۱') || cardText.includes('سوئیت ۲')) {
                maxLimit = 3;
            } else if (urlString.includes('suite-three') || urlString.includes('suite-four') || cardText.includes('سوئیت ۳') || cardText.includes('سوئیت ۴')) {
                maxLimit = 4;
            } else if (urlString.includes('suite-five') || cardText.includes('سوئیت ۵')) {
                maxLimit = 5;
            }

            qtyInput.setAttribute('max', maxLimit);
            qtyInput.setAttribute('min', '1');

            if (qtyInput.dataset.controlled !== "true") {
                qtyInput.dataset.controlled = "true";

                const validateValue = function() {
                    let val = parseInt(this.value);
                    if (isNaN(val)) return;
                    
                    if (val > maxLimit) {
                        this.value = maxLimit;
                    } else if (val < 1) {
                        this.value = 1;
                    }
                };

                qtyInput.addEventListener('input', validateValue);
                qtyInput.addEventListener('change', validateValue);
            }
        });
    }

    // اجرای کد پس از لود کامل صفحه
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMtalQtyControl);
    } else {
        initMtalQtyControl();
    }

    // پوشش ایجکس‌های جت‌انجن و المنتور بدون تداخل
    if (window.jQuery) {
        jQuery(document).on('submit_success elementor/popup/show jet-engine/ajax-filters/applied ajaxComplete', function() {
            setTimeout(initMtalQtyControl, 300);
        });
    }
})();

/* MTAL=============================================================================================
/*                               تنظیمات پایه کانتینر بازشونده نمایش بیشتر                          
/* ==============================================================================================JS*/
document.addEventListener('DOMContentLoaded', function () {
    const expandableContainers = document.querySelectorAll('.mtal-expandable');
    const floatingBtn = document.querySelector('.mtal-floating-collapse');

    expandableContainers.forEach(container => {
        const btn = container.querySelector('.mtal-expand-btn');
        if (!btn) return;

        const btnText = btn.querySelector('.elementor-button-text') || btn;
        const moreText = btnText.textContent.trim() || 'نمایش بیشتر';
        const lessText = 'نمایش کمتر';

        const getInitialHeight = () => {
            return getComputedStyle(container).getPropertyValue('--mtal-max-height').trim() || '400px';
        };

        // تابع بستن مشترک برای دکمه اصلی و فلش شناور
        const collapseContainer = () => {
            container.style.maxHeight = getInitialHeight();
            container.classList.remove('is-expanded');
            btnText.textContent = moreText;
            if (floatingBtn) floatingBtn.classList.remove('is-visible');

            // اسکرول نرم به بالای کانتینر
            const rect = container.getBoundingClientRect();
            if (rect.top < 0) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // مدیریت نمایش فلش شناور هنگام اسکرول
        window.addEventListener('scroll', function () {
            if (!container.classList.contains('is-expanded') || !floatingBtn) return;
            
            const rect = container.getBoundingClientRect();
            // اگر کاربر از ابتدای کانتینر رد شده و هنوز به انتهای آن نرسیده است
            if (rect.top < -300 && rect.bottom > 300) {
                floatingBtn.classList.add('is-visible');
            } else {
                floatingBtn.classList.remove('is-visible');
            }
        });

        // کلیک روی دکمه اصلی المنتور
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const isExpanded = container.classList.contains('is-expanded');

            if (isExpanded) {
                collapseContainer();
            } else {
                container.style.maxHeight = '2500px';
                container.classList.add('is-expanded');
                btnText.textContent = lessText;
            }
        });

        // کلیک روی فلش شناور کنار صفحه
        if (floatingBtn) {
            floatingBtn.addEventListener('click', function (e) {
                e.preventDefault();
                collapseContainer();
            });
        }
    });
});
/* MTAL=============================================================================================
/*                               کانتینر نوار روان                         
/* ==============================================================================================JS*/
document.addEventListener('DOMContentLoaded', () => {
    const initMtalMarquees = () => {
        const marquees = document.querySelectorAll('.mtal-marquee');

        marquees.forEach((marquee) => {
            const track = marquee.querySelector('.mtal-marquee-track');
            if (!track) return;

            // در صورت اجرای مجدد، ابتدا کلون‌های قبلی را حذف می‌کنیم تا آیتم‌های اصلی تمیز بمانند
            track.querySelectorAll('[data-mtal-clone="1"]').forEach((el) => el.remove());

            const baseItems = Array.from(track.children);
            const containerWidth = marquee.getBoundingClientRect().width;

            if (baseItems.length === 0 || containerWidth === 0) return;

            const singleSetWidth = track.scrollWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;

            const setsPerHalf = Math.max(
                1,
                Math.ceil((containerWidth + 120) / Math.max(singleSetWidth, 1))
            );

            const fragment = document.createDocumentFragment();

            for (let half = 0; half < 2; half++) {
                for (let s = 0; s < setsPerHalf; s++) {
                    baseItems.forEach((item) => {
                        if (half === 0 && s === 0) return;

                        const clone = item.cloneNode(true);
                        clone.setAttribute('data-mtal-clone', '1');
                        clone.setAttribute('aria-hidden', 'true');
                        fragment.appendChild(clone);
                    });
                }
            }

            track.appendChild(fragment);

            const totalItemsInOneHalf = baseItems.length * setsPerHalf;
            const allChildren = Array.from(track.children);

            const firstItem = allChildren[0];
            const firstItemOfSecondHalf = allChildren[totalItemsInOneHalf];

            let shiftPx = setsPerHalf * (singleSetWidth + gap);

            if (firstItem && firstItemOfSecondHalf) {
                const r1 = firstItem.getBoundingClientRect();
                const r2 = firstItemOfSecondHalf.getBoundingClientRect();
                shiftPx = Math.abs(r2.left - r1.left);
            }

            track.style.setProperty('--mtal-shift', `${shiftPx}px`);

            track.style.animation = 'none';
            track.offsetHeight;
            track.style.animation = '';
        });
    };

    window.addEventListener('load', initMtalMarquees);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMtalMarquees, 200);
    });
});