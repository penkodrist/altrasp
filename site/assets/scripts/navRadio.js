let allNavBtn = document.querySelectorAll('.navBtn')
allNavBtn.forEach(el => { el.addEventListener('click', function () { navRadio(this) }) })
function navRadio(thisBtn) {
    if (!(thisBtn.getAttribute('data-href') === 'subjectsSchedule')) {
        allNavBtn.forEach(el => { el.classList.remove('toggled') })
        thisBtn.classList.add('toggled')
    }
}