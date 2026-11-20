(function () {
    function getPreloader() {
        return document.getElementById('alachigh-preloader');
    }

    function hidePreloader() {
        const preloader = getPreloader();
        if (!preloader || preloader.classList.contains('fade-out')) return;

        preloader.classList.add('fade-out');
        setTimeout(() => {
            const current = getPreloader();
            if (current && current.classList.contains('fade-out')) {
                current.remove();
            }
        }, 500);
    }

    // تایمر نجات مستقل از DOMContentLoaded (مثلاً ۶ ثانیه)
    const safetyTimer = setTimeout(hidePreloader, 6000);

    window.addEventListener('load', function () {
        clearTimeout(safetyTimer);
        hidePreloader();
    });

    document.addEventListener('DOMContentLoaded', function () {
        const savedPreloader = getPreloader();

        document.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (
                link &&
                link.href &&
                link.hostname === window.location.hostname &&
                !link.getAttribute('target') &&
                !link.getAttribute('download') &&
                !link.getAttribute('href').startsWith('#') &&
                !link.href.includes('#')
            ) {
                let preloader = getPreloader();
                if (!preloader && savedPreloader) {
                    document.body.prepend(savedPreloader);
                    preloader = savedPreloader;
                }
                if (preloader) {
                    preloader.classList.remove('fade-out');
                }
            }
        });
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            clearTimeout(safetyTimer);
            const preloader = getPreloader();
            if (preloader) preloader.remove();
        }
    });
})();