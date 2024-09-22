let allWarnBtns = document.querySelectorAll('.btn1')
let warnScreen = document.querySelector('.warningScreen')
let warnContent = document.querySelector('.warnContentWrapper')
allWarnBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        warnScreenEvent(this)
    })
})
if (localStorage.getItem("do_not_show_indev_warning") === "true") {
    warnScreen.remove()
    allWarnBtns.forEach(btn => {
        btn.removeEventListener("click", warnScreenEvent)
    })
}
function warnScreenEvent (thisBtn) {
    if (thisBtn.classList[1] === "doNotShowBtn") {
        localStorage.setItem("do_not_show_indev_warning", "true")
    }
    warnScreen.style.opacity = '0'
    warnContent.style.transform = 'scale(0.95)'
    setTimeout(() => {
        warnScreen.remove()
    }, 250)
}
window.addEventListener("load", () => {
    warnScreen.style.opacity = '1'
})