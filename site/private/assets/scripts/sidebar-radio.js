let sBtns = document.querySelectorAll('.sBtn')
let waBtn = document.querySelector('.waBtn')
let settingsPage = document.querySelector('.settingsPage')
let mainPage = document.querySelector('.mainPage')
sBtns.forEach(e => {
    e.addEventListener('click', sidebarRadio)
})
waBtn.addEventListener('click', sidebarRadio)
function sidebarRadio(event) {
    switch ((event.target).getAttribute('data-action')) {
        case "content-dropdown":
            break
        case "schedule-calls":
            sBtns.forEach(e => {
                if (e.classList.contains('active')) {
                    e.classList.remove('active')
                }
            });
            (event.target).classList.add('active')
            dayBtns.forEach(e => {
                e.classList.remove('active')
            })
            contentContainer.classList.add('sidebarHidden')
            menuBtn.classList.remove('active')
            break
        case "settings":
            settingsPage.classList.add('active')
            mainPage.classList.add('hidden')
            break
        case "app":
            window.location.href = '/app'
            break
        case "settings-close":
            settingsPage.classList.remove('active')
            mainPage.classList.remove('hidden')
            removeOutlining()
    }

}