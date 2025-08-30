let allTriggers = document.querySelectorAll('.settingDropdown');
allTriggers.forEach(e => {
    e.addEventListener('click', sDropdownEvent)
})

let targetedEl

let ddSearchField
let ddItems

// создание элементов в оперативной памяти с целью невозможности модифицировать слой sdw в devtools
let sdw = document.createElement('div')
sdw.className = 'settingsDropdownWrapper'

let wrapperDDToggleLayer = document.createElement('div')
wrapperDDToggleLayer.className = 'wrapperDDToggleLayer'
wrapperDDToggleLayer.addEventListener('click', sdwEvent)
sdw.appendChild(wrapperDDToggleLayer)

let dropdown = document.createElement('div')
dropdown.className = 'dropdown'
sdw.appendChild(dropdown)

let searchNotFound = document.createElement('div')
searchNotFound.className = 'searchNotFound'
searchNotFound.innerText = 'Мы ничего не нашли :('

async function sDropdownEvent(event) {
    // костыль, чтобы event.target не возвращал внутренние элементы
    if (!(event.target.classList.contains('.settingDropdown'))) {
        targetedEl = event.target.closest('.settingDropdown');
    } else { targetedEl = event.target }
    switch (targetedEl.classList.contains('active')) {
        case false:
            formContents(targetedEl.getAttribute('data-dd-type'), targetedEl.getAttribute('data-search'))

            ddItems.forEach(e => {
                if (e.innerText === targetedEl.innerText) {
                    e.classList.add('selected')
                }
            })

            dropdown.style.left = targetedEl.offsetLeft + 'px'
            dropdown.style.top = targetedEl.offsetTop + 'px'
            dropdown.style.width = targetedEl.getBoundingClientRect().width + 'px'

            dropdown.style.zIndex = '22'
            targetedEl.style.zIndex = '23'

            settingsPage.appendChild(sdw)

            targetedEl.classList.add('active')
            setTimeout(() => { dropdown.classList.add('active') })
            break
        case true:
            console.log('triggered the dropdown event, NOT sdw')
            sdwEvent()
            break
    }
}
function formContents(type, isSearch) {
    switch (isSearch) {
        case null: {
            dropdown.innerHTML =
                `
                <div class="ddContent"></div>
                `
            formItems(type)
        }
        break
        default: {
            dropdown.innerHTML =
                `
                <div class="ddSearch">
                    <input placeholder="Поиск" type="text">
                </div>
                <div class="ddContent">
                    
                </div>
                `
            ddSearchField = dropdown.querySelector('.ddSearch input')
            ddSearchField.addEventListener('input', ddSearchEvent)
            formItems(type)
        }
    }
}
function formItems(type) {
    let tempQs = dropdown.querySelector('.ddContent')
    if (type !== 'chgr') {
        for (let i = 0; i < Object.keys(settingsData[type]).length; i++) {
            tempQs.innerHTML =
                tempQs.innerHTML +
                `
                        <div class="ddItem" data-option-value="${Object.keys(settingsData[type])[i]}">${settingsData[type][Object.keys(settingsData[type])[i]]}</div>
                        `
            ddItems = dropdown.querySelectorAll('.ddItem')
            ddItems.forEach(e => {
                e.addEventListener('click', optionSelect)
            })
        }
    } else {
        for (let i = 0; i < Object.keys(groupsData).length; i++) {
            tempQs.innerHTML =
                tempQs.innerHTML +
                `
                        <div class="ddItem" data-option-value="${Object.keys(groupsData)[i]}">${groupsData[Object.keys(groupsData)[i]]}</div>
                        `
            ddItems = dropdown.querySelectorAll('.ddItem')
            ddItems.forEach(e => {
                e.addEventListener('click', optionSelect)
            })
        }
    }
}
function sdwEvent() {
    dropdown.addEventListener('transitionend', sdwRemove)
    dropdown.classList.remove('active');
    function sdwRemove(event) {
        if (event.target === dropdown) {
            sdw.remove()
            dropdown.innerHTML = ''
            targetedEl.classList.remove('active')
            targetedEl.style.zIndex = ''
            dropdown.removeEventListener('transitionend', sdwRemove)
        }
    }
}
function ddSearchEvent(event) {
    ddItems.forEach(e => {
        if (!(((e.innerText).toLowerCase()).includes(event.target.value.toLowerCase()))) {
            e.classList.add('hidden')
        } else {
            e.classList.remove('hidden')
        }
        if ([...ddItems].every(e => e.classList.contains('hidden'))) {
            let tempQs = dropdown.querySelector('.ddContent')
            tempQs.appendChild(searchNotFound)
        } else {
            searchNotFound.remove()
        }
    })
}
function optionSelect(event) {
    ddItems.forEach(e => {
        e.classList.remove('selected')
        if (e.innerText === targetedEl.innerText) {
            e.classList.add('selected')
        }
    })
    targetedEl.querySelector('[data-selected-option]').innerText = event.currentTarget.innerText
    localStorage.setItem(targetedEl.getAttribute('data-dd-type'), event.currentTarget.getAttribute('data-option-value'))
    if (targetedEl.getAttribute('data-dd-type') === 'chgr') {
        waBtn.addEventListener('click', groupChoseSchUpdate)
        groupHeader.innerText = groupsData[localStorage.getItem('chgr')]
    }
    function groupChoseSchUpdate() {
        spaEvent(localStorage.getItem('chgr'), '0')
        waBtn.removeEventListener('click', groupChoseSchUpdate)
    }
    sdwEvent()
    switch (targetedEl.getAttribute('data-dd-type')) {
        case 'sel-theme':
            document.querySelector('html').setAttribute('theme', event.currentTarget.getAttribute('data-option-value'))
            break
    }
}
// setOptions используется только во время загрузки сайта и нигде больше, так как по сути является косметической
async function setOptions() {
    allTriggers.forEach(e => {
        let selOpt = e.querySelector('[data-selected-option]')
        if (e.getAttribute('data-dd-type') !== 'chgr') {
            selOpt.innerText = settingsData[e.getAttribute('data-dd-type')][localStorage.getItem(e.getAttribute('data-dd-type'))]
        } else {
            selOpt.innerText = groupsData[localStorage.getItem(e.getAttribute('data-dd-type'))]
        }
    })
}