let allGlobalDD = document.querySelectorAll('.gl-dd')
let ddGlobalScreenWrapper = document.querySelector('.ddGlobalScreenWrapper')
let ddGlobalOptions
let thisVarGl
let ddGlobalFix
const ddContent = {
    "themes": {
        "nord": "Nord (по умолчанию)",
        "light": "Светлая"
    }
}
allGlobalDD.forEach(e => {
    e.addEventListener("click", function() {
        glDDEvent(this, this.getAttribute('dd-this-layer'), this.getAttribute('dd-type'))
    })
})
ddGlobalScreenWrapper.addEventListener("click", () => {
    closeGSW(ddGlobalScreenWrapper.querySelector('.ddGlobal'))
})
window.addEventListener('resize', ddResizeFix)
function glDDEvent(thisVar, layer, type) {
    thisVarGl = thisVar
    let ddGlobal = document.createElement('div')
    ddGlobal.classList.add('ddGlobal')
    ddGlobalScreenWrapper.appendChild(ddGlobal)
    ddGlobalScreenWrapper.style.zIndex = layer
    ddGlobal.style.zIndex = layer
    ddGlobal.style.left = thisVar.getBoundingClientRect().left
    ddGlobal.style.width = thisVar.getBoundingClientRect().width
    ddGlobal.style.top = thisVar.getBoundingClientRect().top + thisVar.getBoundingClientRect().height + 5 + 'px'
    ddGlobal.style.borderRadius = getComputedStyle(thisVar).borderRadius
    ddGlobalScreenWrapper.classList.add('toggled')
    ddGlobal.style.backgroundColor = `rgba(20, 20, 20, 0.75)`
    for (let i = 0; i < Object.keys(ddContent[type]).length; i++) {
        if (thisVar.innerText === Object.values(ddContent[type])[i]) {
            ddGlobal.innerHTML = ddGlobal.innerHTML +
                `
            <div class="ddGlobal-option isSelected" dd-ls-value="${Object.keys(ddContent[type])[i]}">${Object.values(ddContent[type])[i]}</div>
            `
        } else {
            ddGlobal.innerHTML = ddGlobal.innerHTML +
                `
            <div class="ddGlobal-option" dd-ls-value="${Object.keys(ddContent[type])[i]}">${Object.values(ddContent[type])[i]}</div>
            `
        }
        ddGlobalOptions = ddGlobalScreenWrapper.querySelectorAll('.ddGlobal-option')
    }
    ddGlobalOptions.forEach(e => {
        e.addEventListener('click', function () {
            optionSelectionFunc(this, thisVar)
        })
    })
}
function optionSelectionFunc(thisVar, whichdd) {
    localStorage.setItem(whichdd.getAttribute('dd-ls-name'), thisVar.getAttribute('dd-ls-value'))
    ddGlobalOptions.forEach(e => {
        e.classList.remove('isSelected')
    })
    thisVar.classList.add('isSelected')
    whichdd.querySelector('.selected-gl-dd').textContent = thisVar.innerText
    if (whichdd.getAttribute('dd-type') === 'themes') {
        changeTheme(thisVar.getAttribute('dd-ls-value'))
    }
}
function closeGSW(which) {
    ddGlobalScreenWrapper.classList.remove('toggled')
    allGlobalDD.forEach(e => {
        e.style.zIndex = ''
    })
    setTimeout(() => {
        which.remove()
    }, 201)
}
function ddResizeFix() {
    ddGlobalFix = document.querySelector('.ddGlobal')
    if (ddGlobalFix !== null) {
        ddGlobalFix.style.left = thisVarGl.getBoundingClientRect().left
        ddGlobalFix.style.top = thisVarGl.getBoundingClientRect().top + 55 + 'px'
    }
}
function changeTheme(whichTheme) {
    let siteRoot = document.querySelector('html')
    siteRoot.setAttribute('theme', whichTheme)
}