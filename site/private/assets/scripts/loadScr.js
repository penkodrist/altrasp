let ddLoadContent = {
    "sel-theme": {
        "nord": "Nord (по умолчанию)",
        "light": "Светлая"
    }
}
resolvingUserAgent().then(() => {
    setDefaults().then(() => {
        assignDD().then(() => {
            setTheme().then(() => {
                currentGroupPos().then(() => {
                    window.addEventListener("load", () => {
                        loadingScreenOverlayRemove()
                    })
                })
            })
        })
    })
})

// 1, deciding to show apk download button or not
async function resolvingUserAgent() {
    let headerContainer = document.querySelector('.headerContainer')
    let siteRoot = document.querySelector('html')
    let downloadButtonHTML =
        `
        <img alt="android" src="./private/assets/imgs/android.svg">
        `
    let downloadButtonObject = document.createElement('a')
    downloadButtonObject.setAttribute("href", "/app")
    downloadButtonObject.className = 'downloadApp'
    downloadButtonObject.innerHTML = downloadButtonHTML
    if ((window.navigator.userAgent.indexOf("Android") > -1 && window.navigator.userAgent.indexOf("Build") > -1 ) === false) {
        if (window.navigator.userAgent.indexOf("Win64") > -1)  { return }
        if (window.navigator.userAgent.indexOf("Mac OS") > -1)  { return }
        headerContainer.appendChild(downloadButtonObject)
    }
    if (window.navigator.userAgent.indexOf("Build") > -1) {
        siteRoot.setAttribute("android", "true")
    }
}

// 2, setting default values for localStorage entries
async function setDefaults() {
    if (localStorage.getItem('default') === null) {
        localStorage.setItem('sel-theme', 'nord')
        localStorage.setItem('default', '1')
    }
}

// 3, assigning vars to dropdowns
async function assignDD() {
    let allGlobalDDs = document.querySelectorAll('.gl-dd')
    let mt
    let mtAttr
    for (let i = 0, l = Array.from(allGlobalDDs).length; i < l; i++) {
        mt = Array.from(allGlobalDDs)[i]
        mtAttr = mt.getAttribute('dd-ls-name')
        mt.querySelector('.selected-gl-dd').textContent = ddLoadContent[mtAttr][localStorage.getItem(mtAttr)]
    }
}

// 4, setting global theme
async function setTheme() {
    let siteRoot = document.querySelector('html')
    if (ddLoadContent["sel-theme"][localStorage.getItem("sel-theme")] === undefined) {
        alert('Ошибка.\n\nЗаданная тема не была найдена. Будет выставлена тема Nord.')
        localStorage.setItem("sel-theme", "nord")
    }
    siteRoot.setAttribute('theme', localStorage.getItem('sel-theme'))
}

// 5, centering current group
async function currentGroupPos() {
    let currentGroup = document.querySelector('.currentGroup')
    currentGroup.innerText = localStorage.getItem('chgrName')
    currentGroup.style.left = currentGroup.closest('.headerContainer').getBoundingClientRect().width / 2 - currentGroup.getBoundingClientRect().width / 2 + 'px'
    window.addEventListener('resize', () => {
        currentGroup.style.left = currentGroup.closest('.headerContainer').getBoundingClientRect().width / 2 - currentGroup.getBoundingClientRect().width / 2 + 'px'
    })
}

// last, removing loading screen
function loadingScreenOverlayRemove() {
    let loadingScreen = document.querySelector('.loadingScreen')
    setTimeout(() => {
        loadingScreen.style.opacity = 0
    }, 100)
    setTimeout(() => {
        loadingScreen.remove()
    }, 300)
}