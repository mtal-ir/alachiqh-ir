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

