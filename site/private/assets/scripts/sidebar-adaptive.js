let menuBtn = document.querySelector('.menuBtn');
let contentContainer = document.querySelector('.content');
let spaMainContainer = document.querySelector('[data-spa]')
let appDiv = document.querySelector('.appDiv');

menuBtn.addEventListener('click', toggleSidebar)
window.addEventListener('resize', sidebarAdaptiveFix)

function toggleSidebar() {
    if (!(contentContainer.classList.contains('sidebarHidden'))) {
        contentContainer.classList.add('sidebarHidden');
        menuBtn.classList.remove('active')
    } else {
        contentContainer.classList.remove('sidebarHidden');
        menuBtn.classList.add('active')
    }
}

sidebarAdaptiveFix()

function sidebarAdaptiveFix() {
    if (window.innerWidth < 720) {
        spaMainContainer.style.minWidth = window.innerWidth - (parseInt(getComputedStyle(appDiv).paddingLeft) + parseInt(getComputedStyle(appDiv).paddingRight));
    } else {
        spaMainContainer.style.minWidth = ''
    }
}