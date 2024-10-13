let openSG = document.querySelector('.chgr-screen-btn')
let closeSG = document.querySelector('.sg-close-btn')
let sgScreenWrapper = document.querySelector('.selectGroupScreenWrapper')
let searchField = document.querySelector('.sg-search-field')
let groupsLoader = document.querySelector('.sg-groups-loader')
let groupsContainer = document.querySelector('.sg-groups-container')
let allGroups
let typingTimeout
let currentGroup = document.querySelector('.currentGroup')
openSG.querySelector('.selectedGr').innerText = localStorage.getItem('chgrName')
openSG.addEventListener('click', openSGEvent)
closeSG.addEventListener('click', closeSGEventSpec)
let closeSGAvailability = true
searchField.addEventListener('input', function () {
    searchGroups(this.querySelector('input').value)
})
function searchGroups(requestText) {
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
        allGroups.forEach(e => {
            e.style.opacity = '0'
            setTimeout(() => {
                if (e.innerText.toLowerCase().indexOf(requestText.toLowerCase()) > -1) {
                    e.style.display = 'block'
                    setTimeout(() => {
                        e.style.opacity = '1'
                    }, 10)
                } else {
                    e.style.display = 'none'
                }
            }, 250)
        })
    }, 300)
}
function openSGEvent() {
    sgScreenWrapper.classList.add('toggled')
    groupsLoader.style.opacity = '1'
    groupsContainer.style.opacity = '0'
    groupsContainer.innerHTML = ''
    fetch('/api/groups', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(res => res.text())
        .then(data => {
            groupsLoader.style.opacity = '0'
            groupsContainer.innerHTML = data
            groupsContainer.style.opacity = '1'
        })
        .then(() => {
            allGroups = sgScreenWrapper.querySelectorAll('.sg-group')
            allGroups.forEach(e => {
                e.addEventListener('click', function () {
                    chgrEvent(this.getAttribute('chgr'), this.innerText)
                })
            })
        })
}
function chgrEvent(chosenGr, chosenGrName) {
    closeSG.style.pointerEvents = ''
    closeSG.style.opacity = ''
    closeSGAvailability = true
    localStorage.setItem('chgr', chosenGr)
    chgr = chosenGr
    localStorage.setItem('chgrName', chosenGrName)
    openSG.querySelector('.selectedGr').innerText = localStorage.getItem('chgrName')
    currentGroup.innerText = chosenGrName
    spaEvent(localStorage.getItem('chgr'), '0')
    closeSGEvent()
    closeSWEvent()
    allNavBtn.forEach(e => {
        e.classList.remove('toggled')
    })
    Array.from(allNavBtn)[0].classList.add('toggled')
    Array.from(allDayBtns)[0].classList.add('selected')
}
function closeSGEvent() {
    sgScreenWrapper.classList.remove('toggled')
}
function closeSGEventSpec() {
    if (closeSGAvailability === true) {
        sgScreenWrapper.classList.remove('toggled')
    }
}