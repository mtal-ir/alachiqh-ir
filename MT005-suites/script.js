// MTAL=============================================================================================
//                     مودال فرم رزرو موبایل و تبلت
// ===============================================================================================JS

const mtalreserves = document.querySelectorAll(".mtalreserve");
const frontreserve = document.querySelector(".frontreserve");
const closereserve = document.querySelector(".closereserve");

mtalreserves.forEach(btn => {
    btn.onclick = (e) => {
        // بررسی اینکه آیا در دسکتاپ هستیم یا موبایل/تبلت
        if (window.innerWidth > 1024) {
            // در دسکتاپ: اسکرول نرم به سمت فرم رزرو
            frontreserve.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // اضافه کردن یک افکت چشمک‌زن یا بوردر موقت برای جلب توجه کاربر به فرم
            frontreserve.style.transition = "all 0.3s ease";
            frontreserve.style.boxShadow = "0 0 0 4px rgba(107, 142, 35, 0.5)"; // رنگ سبز برند
            setTimeout(() => {
                frontreserve.style.boxShadow = "none";
            }, 1500);
        } else {
            // در موبایل و تبلت: باز شدن به صورت مودال (پاپ‌آپ) مثل قبل
            frontreserve.classList.add("open");
        }
    }
});

if (closereserve) {
    closereserve.onclick = () => {
        frontreserve.classList.remove("open");
    }
}

frontreserve.onclick = (e) => {
    if (e.target === frontreserve) {
        frontreserve.classList.remove("open");
    }
}
//---------------------------------------------------------------کارت جاباما و جاجیگا و اتاقک
function calculateGap(width) {
    const minWidth = 1024;
    const maxWidth = 1456;
    const minGap = 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

function initTestimonials(container) {
    const items = container.querySelectorAll('.testimonial-item');
    const images = container.querySelectorAll('.testimonial-image');
    const imageContainer = container.querySelector('.image-container');
    const prevBtn = container.querySelector('.prev-button');
    const nextBtn = container.querySelector('.next-button');
    const quotes = container.querySelectorAll('.quote');
    
    if (!imageContainer || !prevBtn || !nextBtn || items.length === 0) return;

    const colors = {
        name: container.dataset.nameColor,
        designation: container.dataset.designationColor,
        testimony: container.dataset.testimonyColor,
        arrowBg: container.dataset.arrowBg,
        arrowFg: container.dataset.arrowFg,
        arrowHover: container.dataset.arrowHover
    };
    
    const sizes = {
        name: container.dataset.nameSize,
        designation: container.dataset.designationSize,
        quote: container.dataset.quoteSize
    };
    
    const autoplay = container.dataset.autoplay === 'true';
    let activeIndex = 0;
    let autoplayInterval = null;
    let containerWidth = imageContainer.offsetWidth;

    // ذخیره متن اصلی برای جلوگیری از به هم ریختگی در انیمیشن تکراری
    quotes.forEach(quote => {
        if (!quote.dataset.originalText) {
            quote.dataset.originalText = quote.textContent;
        }
    });

    // Apply colors and sizes
    container.querySelectorAll('.name').forEach(el => {
        el.style.color = colors.name;
        el.style.fontSize = sizes.name;
    });
    container.querySelectorAll('.designation').forEach(el => {
        el.style.color = colors.designation;
        el.style.fontSize = sizes.designation;
    });
    quotes.forEach(el => {
        el.style.color = colors.testimony;
        el.style.fontSize = sizes.quote;
    });
    
    prevBtn.style.backgroundColor = colors.arrowBg;
    nextBtn.style.backgroundColor = colors.arrowBg;
    if(prevBtn.querySelector('i')) prevBtn.querySelector('i').style.color = colors.arrowFg;
    if(nextBtn.querySelector('i')) nextBtn.querySelector('i').style.color = colors.arrowFg;

    function updateImages() {
        containerWidth = imageContainer.offsetWidth;
        const gap = calculateGap(containerWidth);
        const maxStickUp = gap * 0.8;
        const len = images.length;

        images.forEach((img, index) => {
            const isActive = index === activeIndex;
            const isLeft = (activeIndex - 1 + len) % len === index;
            const isRight = (activeIndex + 1) % len === index;

            if (isActive) {
                img.style.cssText = `z-index: 3; opacity: 1; pointer-events: auto; transform: translateX(0px) translateY(0px) scale(1) rotateY(0deg);`;
            } else if (isLeft) {
                img.style.cssText = `z-index: 2; opacity: 1; pointer-events: auto; transform: translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg);`;
            } else if (isRight) {
                img.style.cssText = `z-index: 2; opacity: 1; pointer-events: auto; transform: translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg);`;
            } else {
                img.style.cssText = `z-index: 1; opacity: 0; pointer-events: none;`;
            }
        });
    }

    function animateQuote(quoteEl) {
        const text = quoteEl.dataset.originalText || quoteEl.textContent;
        const words = text.split(' ');
        quoteEl.innerHTML = words.map((word, i) => 
            `<span class="quote-word" style="animation-delay: ${i * 0.025}s;">${word}</span>`
        ).join(' ');
        
        setTimeout(() => {
            quoteEl.querySelectorAll('.quote-word').forEach(el => el.classList.add('animate'));
        }, 10);
    }

    function updateActive() {
        items.forEach((item, index) => {
            if (index === activeIndex) {
                item.classList.add('active');
                animateQuote(item.querySelector('.quote'));
            } else {
                item.classList.remove('active');
            }
        });
        updateImages();
    }

    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        if (autoplay) {
            autoplayInterval = setInterval(() => {
                activeIndex = (activeIndex + 1) % items.length;
                updateActive();
            }, 5000);
        }
    }

    function next() {
        activeIndex = (activeIndex + 1) % items.length;
        updateActive();
        resetAutoplay();
    }

    function prev() {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActive();
        resetAutoplay();
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    prevBtn.addEventListener('mouseenter', () => prevBtn.style.backgroundColor = colors.arrowHover);
    prevBtn.addEventListener('mouseleave', () => prevBtn.style.backgroundColor = colors.arrowBg);
    nextBtn.addEventListener('mouseenter', () => nextBtn.style.backgroundColor = colors.arrowHover);
    nextBtn.addEventListener('mouseleave', () => nextBtn.style.backgroundColor = colors.arrowBg);

    // --- اضافه شدن قابلیت Swipe (لمسی) برای موبایل ---
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // حداقل فاصله جابجایی انگشت برای ثبت به عنوان سوایپ
        if (touchEndX < touchStartX - swipeThreshold) {
            // کشیدن به سمت چپ -> رفتن به اسلاید بعدی
            next();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // کشیدن به سمت راست -> رفتن به اسلاید قبلی
            prev();
        }
    }
   
   // محدود کردن کیبورد
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });
    if (!container.hasAttribute('tabindex')) {
        container.setAttribute('tabindex', '0');
    }

    // Debounce برای Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateImages, 100);
    });

    if (autoplay) {
        resetAutoplay();
    }

    updateActive();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.testimonial-container').forEach(initTestimonials);
});
