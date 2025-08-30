
document.addEventListener("DOMContentLoaded", () => {
    let loadingScreen = document.querySelector(".loadScreen")
    let status = document.querySelector(".loadingStatus")
    status.innerText = "Получение списка групп"
    fetch('/api/groups', {
        method: 'GET',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        }
    })
        .then(res => res.json())
        .then(data => {
            groupsData = data
            status.innerText = 'Список групп получен'
        })
        .then(setDefaults)
        .then(setOptions)
        .then(assignGroupHeader)
        .then(() => {
            if (localStorage.getItem('default') !== '1') {
                formGroupsBtns()
            }
        })
        .then(formDayBtns)
        .then(setThemeOnStartup)
        .then(() => {
            status.innerText = 'Загрузка расписания'
            dayBtns[0].classList.add('active')
            spaEventStartup(localStorage.getItem('chgr'), '0')
        })
        .then(() => {
            status.innerText = 'Загрузка завершена'
            setTimeout(hideLoadScreen, 250)
        })
    async function assignGroupHeader() {
        groupHeader.innerText = groupsData[localStorage.getItem('chgr')]
        status.innerText = 'Присвоение выбранной группы'
    }
    async function setDefaults() {
        if (localStorage.getItem('default') !== '1') {
            localStorage.setItem('sel-theme', 'nord')
            localStorage.setItem('weekday', '0')
            localStorage.setItem('appCustomBackground', 'null')
            status.innerText = 'Применение настроек по умолчанию'
        }
    }
    async function setThemeOnStartup() {
        document.querySelector('html').setAttribute('theme', localStorage.getItem('sel-theme'))
    }
    function hideLoadScreen() {
        loadingScreen.classList.add("hiding")
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove()
        })
    }
})