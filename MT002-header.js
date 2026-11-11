
<script src="https://a.alachiqh.ir//wp-content/themes/mohammad-talebi-child-theme/MT002-header/script.js"></script>




// MTAL=============================================================================================
//                                          منو دولایه هدر
// ===============================================================================================JS
// تمام دکمه‌های باز کردن منو را بگیرید
const mtalmenus = document.querySelectorAll(".mtalmenu");

mtalmenus.forEach(mtalmenu => {
    mtalmenu.onclick = () => {
        // پیدا کردن منوی مربوط به همین دکمه (مثلاً اگر درون یک کانتینر مشترک هستند یا با ساختار خاصی مرتبط‌اند)
        // روش ساده: فرض می‌کنیم هر منو یک frontmenu دارد یا از closest استفاده می‌کنیم
        const parent = mtalmenu.closest(".menu-container"); // اگر والد مشترکی دارند
        const frontmenu = parent ? parent.querySelector(".frontmenu") : document.querySelector(".frontmenu");
        
        if (frontmenu) {
            frontmenu.classList.add("active");
        }
    };
});

// بستن منوها با کلیک روی عناصر دارای کلاس clousemenu
const closeElements = document.querySelectorAll(".clousemenu");

closeElements.forEach(element => {
    element.onclick = () => {
        // پیدا کردن نزدیک‌ترین منوی فعال یا بستن همه منوهای باز
        const parent = element.closest(".menu-container");
        const frontmenu = parent ? parent.querySelector(".frontmenu") : document.querySelector(".frontmenu");
        
        if (frontmenu) {
            frontmenu.classList.remove("active");
        }
    };
});
// JS===============================================================================================
//                               چسبان کردن هدر در اسکرول                      
// =============================================================================================MTAL

document.addEventListener('DOMContentLoaded', function () {
    jQuery(function ($) {
        let startsFromTop = 100; 
        let showOnScrollBackUp = 100; //سرعت باز شدن در اسکرول
        let mywindow = $(window);
        let mypos = mywindow.scrollTop();
        let lowPointPosition = mywindow.scrollTop();
        let scrolling = false; 

        window.addEventListener('scroll', function () {
            scrolling = true;
        });

        setInterval(() => {
            if (scrolling) {
                scrolling = false;
                if (mypos > startsFromTop) {
                    if (mywindow.scrollTop() > mypos) {
                        $('#headernav').addClass('headerup');
                        $('body').addClass('header-is-up'); // اضافه شدن کلاس به بدنه برای تنظیم کارت
                    } else if (mywindow.scrollTop() + showOnScrollBackUp < lowPointPosition) {
                        $('#headernav').removeClass('headerup');
                        $('body').removeClass('header-is-up'); // برداشتن کلاس وقتی هدر باز می‌شود
                        lowPointPosition = mywindow.scrollTop();
                    }
                }
                if (mywindow.scrollTop() > mypos || mywindow.scrollTop() + showOnScrollBackUp < lowPointPosition){
                    lowPointPosition = mywindow.scrollTop();
                }
                mypos = mywindow.scrollTop();
            }
            if (mywindow.scrollTop() < startsFromTop) {
                $('#headernav').removeClass('headerup');
                $('body').removeClass('header-is-up');
            }
        }, 50);//سرعت باز شدن در اسکرول
    });
});