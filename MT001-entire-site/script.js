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
/*                                          پریلودر                          
/* ==============================================================================================JS*/
document.addEventListener("DOMContentLoaded", function () {
    const preloader = document.getElementById('alachigh-preloader');
    
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 500); // همگام با انیمیشن CSS
        }
    }

    // ۱. محو شدن پریلودر به محض لود کامل صفحه
    window.addEventListener('load', hidePreloader);

    // ۲. ظاهر شدن آنی پریلودر به محض کلیک روی لینک‌های داخلی (برای سرعت انتقال بین صفحات)
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (
            link && 
            link.href && 
            link.hostname === window.location.hostname && 
            !link.getAttribute('target') && 
            !link.getAttribute('download') &&
            link.getAttribute('href') !== '#' &&
            !link.getAttribute('href').startsWith('#')
        ) {
            // اگر پریلودر قبلاً حذف شده بود، موقع کلیک روی لینک جدید دوباره ایجادش کن تا کاربر منتظر نماند
            if (!document.getElementById('alachigh-preloader') && preloader) {
                document.body.prepend(preloader);
            }
            if (preloader) {
                preloader.classList.remove('fade-out');
            }
        }
    });

    // ۳. تایمر ایمنی ۲۰ ثانیه‌ای (جلوگیری از گیر کردن کاربر روی لودر)
    setTimeout(hidePreloader, 20000);
});

// ۴. رفع مشکل دکمه Back/Forward مرورگر (bfcache)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        const preloader = document.getElementById('alachigh-preloader');
        if (preloader) preloader.remove();
    }
});
/* MTAL=============================================================================================
/*                               تنظیمات پایه کانتینر بازشونده نمایش بیشتر                          
/* ==============================================================================================JS*/
document.addEventListener('DOMContentLoaded', function () {
    const expandableContainers = document.querySelectorAll('.mtal-expandable');

    expandableContainers.forEach(container => {
        const btn = container.querySelector('.mtal-expand-btn');
        if (!btn) return;

        // پیدا کردن تگ متن داخلی دکمه در المنتور
        const btnText = btn.querySelector('.elementor-button-text') || btn;
        const moreText = btnText.textContent.trim() || 'نمایش بیشتر';
        const lessText = 'نمایش کمتر';

        // خواندن ارتفاع اولیه تعریف شده در CSS
        const getInitialHeight = () => {
            return getComputedStyle(container).getPropertyValue('--mtal-max-height').trim() || '400px';
        };

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const isExpanded = container.classList.contains('is-expanded');

            if (isExpanded) {
                // حالت بستن (نمایش کمتر)
                container.style.maxHeight = getInitialHeight();
                container.classList.remove('is-expanded');
                btnText.textContent = moreText;

                // اسکرول نرم به بالای کانتینر اگر کاربر خیلی پایین رفته باشد
                const rect = container.getBoundingClientRect();
                if (rect.top < 0) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // حالت باز کردن (نمایش بیشتر)
                container.style.maxHeight = container.scrollHeight + 'px';
                container.classList.add('is-expanded');
                btnText.textContent = lessText;
            }
        });
    });
});