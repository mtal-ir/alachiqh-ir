// MTAL=============================================================================================
//                                 کپی شماره کارت در متپکارت به کارت   
// ===============================================================================================JS
const nscopybutton = document.querySelector(".nscopybutton");
const nscopycardtext = document.querySelector(".nscopycardtext");

// بررسی اینکه آیا هر دو المان در صفحه وجود دارند یا خیر
if (nscopybutton && nscopycardtext) {
    nscopybutton.onclick = () => {
        // اضافه کردن کلاس
        nscopycardtext.classList.add("active");

        // بررسی پشتیبانی مرورگر و پروتکل امن
        if (navigator.clipboard) {
            navigator.clipboard.writeText("5022291308014206").catch(err => {
                console.error('خطا در کپی کردن متن: ', err);
            });
        } else {
            console.error('مرورگر از قابلیت کپی پشتیبانی نمی‌کند یا سایت روی HTTPS نیست.');
        }
    };
} 