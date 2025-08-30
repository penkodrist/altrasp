let pgss = document.querySelector('.primaryGroupSelectionScreen')
let allGroupsBtns
let searchBox
let groupsContainer
let groupHeader = document.querySelector('.selectedGroup span')

if (localStorage.getItem('default') === '1') {
    pgss.remove()
} else {
    mainPage.classList.add('hidden')
    groupsContainer = document.querySelector('.groupsContainer')
    searchBox = document.querySelector('.searchBox input')
    searchBox.addEventListener('input', gSearchEvent)
}

function formGroupsBtns() {
    for (let i = 0; i < Object.keys(groupsData).length; i++) {
        groupsContainer.innerHTML = groupsContainer.innerHTML +
            `
            <div class="groupItem" data-target-group="${Object.keys(groupsData)[i]}">${groupsData[Object.keys(groupsData)[i]]}</div>
            `
        allGroupsBtns = document.querySelectorAll('.groupItem')
        allGroupsBtns.forEach(e => {
            e.addEventListener('click', initGroup)
        })
    }

}

function initGroup(event) {
    localStorage.setItem('default', '1')
    localStorage.setItem('chgr', (event.target).getAttribute('data-target-group'))
    groupHeader = groupsData[localStorage.getItem('chgr')]
    pgss.addEventListener('transitionend', pgssRemove)
    pgss.style.opacity = '0'
    pgss.style.transform = 'scale(1.1)'
    mainPage.classList.remove('hidden')
    setOptions().then()
    spaEventStartup(localStorage.getItem('chgr'), '0')
    function pgssRemove(event) {
        if (event.target === pgss) {
            pgss.remove()
        }
    }
}

function gSearchEvent(event) {
    allGroupsBtns.forEach(e => {
        if (!((e.innerText.toLowerCase()).includes((event.target.value).toLowerCase()))) {
            e.style.display = 'none'
        } else {
            e.style.display = ''
        }
    })
}

