/* MTAL=============================================================================================
/*                                      تول تیپ حرفه ای 
/* =============================================================================================CSS*/
/* MTAL=============================================================================================
/*           class:mtal-tooltip              Attribute:data-tooltip|"..."                           
/* =============================================================================================CSS*/
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
// MTAL=============================================================================================
//                                                مودال آرشیو سوییتها
// ===============================================================================================JS

document.addEventListener("DOMContentLoaded", () => {
    const openButtons = document.querySelectorAll(".mtal-open");
    const closeElements = document.querySelectorAll(".mtal-close");
    const modals = document.querySelectorAll(".mtal-front");

    // تابع کمکی برای توقف ویدیوها در مودال بسته شده
    function stopVideosInModal(modal) {
        const html5Videos = modal.querySelectorAll("video");
        html5Videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        const iframes = modal.querySelectorAll("iframe");
        iframes.forEach(iframe => {
            const iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        });
    }

    // ۱. باز کردن مودال هدف بر اساس ویژگی data-target در همان کارت
    openButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            
            // پیدا کردن کارت والد در آرشیو
            const card = button.closest('.jet-listing-grid__item') || button.closest('.elementor-grid-item') || button.closest('.elementor-element');
            if (!card) return;

            // خواندن نام مودال از روی دکمه (data-target)
            const targetId = button.getAttribute("data-target");
            
            // پیدا کردن مودال مورد نظر فقط در داخل همین کارت
            const targetModal = card.querySelector(`#${targetId}`) || card.querySelector(`.${targetId}`);
            
            if (targetModal) {
                targetModal.classList.add("active");
                document.body.style.overflow = "hidden";
            }
        });
    });

    // ۲. بستن مودال با دکمه بستن داخلی
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

    // ۳. بستن مودال با کلیک روی پس‌زمینه تیره پشت مودال
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