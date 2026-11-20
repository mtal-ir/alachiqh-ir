/* JS===============================================================================================
/*                               زیر هدر                                                                   
/* ===========================================================================================MTAL
const updateMtalHeaderOffset = () => {
    const headerEl = document.getElementById('headernav');
    const stickyBars = document.querySelectorAll('.mtal-sticky-below-header');
    if (!stickyBars.length) return;

    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
    stickyBars.forEach((bar) => {
        bar.style.setProperty('--mtal-header-offset', `${headerHeight}px`);
    });
};

window.addEventListener('load', updateMtalHeaderOffset);
window.addEventListener('resize', updateMtalHeaderOffset);
updateMtalHeaderOffset();
*/