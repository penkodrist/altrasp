let ddBtn = document.querySelector('[data-href="subjectsSchedule"]')
let ddScreenWrapper = document.querySelector('.ddScreenWrapper')
let posX
let posY
let objWidth
let dDownBtn = document.querySelector('[data-href="subjectsSchedule"]')
let appDiv = document.querySelector('.appDiv')
const resizeObserver = new ResizeObserver(ddPosFix)
ddScreenWrapper.addEventListener('click', ddHide)
window.addEventListener('resize', ddPosFix)
appDiv.addEventListener('transitionend', ddPosFix)
dDownBtn.addEventListener('click', dropdownEvent)
resizeObserver.observe(dDownBtn)

let allDayBtns = null
allNavBtn.forEach(e => {
    e.addEventListener("click", function () {
        if (this.getAttribute("data-href") !== "subjectsSchedule" && allDayBtns !== null) {
            allDayBtns.forEach(e => {
                e.classList.remove('selected')
            })
        }
    })
})

let dropdownList = document.createElement("div")
dropdownList.className = "dropdownList"

let dropdownObj = document.createElement("div")
dropdownObj.className = "dropdownWrapper"
dropdownObj.appendChild(dropdownList)

let daysArray = {
    0: "Сегодня",
    1: "Завтра",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
}

let newDate = new Date()
let curDay = newDate.getDate() + 1
let curMonth = newDate.getMonth() + 1
let curYear = newDate.getFullYear()
let curMonthLength = new Date(curYear, curMonth, 0).getDate()

// ебать ну и хуета конечно
for (let i = 2; i <= 6; i++) {
    if (curDay !== curMonthLength) {
        curDay++
        daysArray[i] = `${String(curDay).padStart(2, '0')}.${String(curMonth).padStart(2, '0')}.${String(curYear)}`
    } else {
        curDay = 1
        if (curMonth + 1 === 13) {
            curMonth = 1
            curYear++
        } else {
            curMonth++
        }
        daysArray[i] = `${String(curDay).padStart(2, '0')}.${String(curMonth).padStart(2, '0')}.${String(curYear)}`
    }
}

for (let i = 0; i < Object.keys(daysArray).length; i++) {
    let dayBtn = document.createElement("div")
    dayBtn.classList.add("dayBtn")
    dayBtn.textContent = daysArray[i]
    dayBtn.setAttribute('spa-target', `${i}`)
    if (i === 0) { dayBtn.classList.add('selected') }
    dayBtn.addEventListener("click", function () { spaEvent(this.getAttribute('spa-target')) })
    dayBtn.addEventListener("click", function () { daysRadio(this) })
    dropdownList.appendChild(dayBtn)
}
ddScreenWrapper.appendChild(dropdownObj)
allDayBtns = document.querySelectorAll('.dayBtn')

function dropdownEvent () {
    if (!ddScreenWrapper.classList.contains('toggled')) {
        ddPosFix()
        ddScreenWrapper.classList.add('toggled')
        ddBtn.classList.add('preselected')
    } else {
        ddHide()
    }
}

function daysRadio (thisBtn) {
    allDayBtns.forEach((e) => { e.classList.remove('selected') })
    thisBtn.classList.add('selected')
    ddHide(true)
}

function ddHide(selectedStatus) {
    if (selectedStatus === true) {
        allNavBtn.forEach(el => { el.classList.remove('toggled') })
        ddBtn.classList.add('toggled')
    }
    ddScreenWrapper.classList.remove('toggled')
    ddBtn.classList.remove('preselected')
}

function ddPosFix() {
    posX = dDownBtn.getBoundingClientRect().left - 5 + 'px'
    posY = dDownBtn.getBoundingClientRect().top - 5 + 'px'
    objWidth = dDownBtn.getBoundingClientRect().width + 10 + 'px'
    dropdownObj.style.left = posX
    dropdownObj.style.top = posY
    dropdownObj.style.width = objWidth
}