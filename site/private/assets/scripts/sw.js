let settingsScreenWrapper = document.querySelector('.settingsScreenWrapper');
let allOptions = document.querySelectorAll('.sw-option')
let e
let thisContentWrapper
let closeSW = document.querySelector('.closeSW')
let openSW = document.querySelector('.openSW')
allOptions.forEach(e => {
    e.addEventListener('click', function () {
        settingsEvent(this)
    })
})
closeSW.addEventListener("click", closeSWEvent)
openSW.addEventListener("click", openSWEvent)
function settingsEvent (thisVar) {
    e = thisVar.closest('.sw-option-wrapper')
    e.classList.toggle('toggled')
    thisContentWrapper = e.querySelector('.sw-option-content-wrapper')
    if (e.classList.contains('toggled')) {
        e.style.height = thisContentWrapper.scrollHeight + 20 + 'px'
        thisContentWrapper.style.height = thisContentWrapper.scrollHeight + 20 + 'px'
    } else {
        e.style.height = ''
        thisContentWrapper.style.height = ''
    }
}
function closeSWEvent() {
    settingsScreenWrapper.classList.remove('toggled')
}
function openSWEvent() {
    settingsScreenWrapper.classList.add('toggled')
}