let dayBtns
let months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
]
let weekdays = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
]
let labels = [
    "Сегодня",
    "Завтра",
    "Послезавтра"
]
function daysRadio(event) {
    if (event.target.classList.contains('active') || !(event.target.classList.contains('dayBtn'))) {
        return
    }
    sBtns.forEach(e => {
        e.classList.remove('active')
    })
    dayBtns.forEach(e => {
        e.classList.remove('active')
    });
    (event.target).classList.add('active')
    spaEventUI(event)
    contentContainer.classList.add('sidebarHidden')
    menuBtn.classList.remove('active')
}
async function formDayBtns() {
    let labelIndex = 0
    let newDate = new Date()
    let curDay = newDate.getDate()
    let curMonth = newDate.getMonth()
    let curYear = newDate.getFullYear()
    let curWeekDay = newDate.getDay()
    let curMonthLength = new Date(curYear, curMonth, 0).getDate()
    // инфа, нужная для формирования карточки даты - день месяца, название месяца; день недели; полная дата
    for (let i = 0; i <= 2; i++) {
        let dBtnElement = document.createElement('div');
        dBtnElement.className = 'dayBtn labeled'
        dBtnElement.setAttribute('data-target', `${i}`)
        dBtnElement.innerHTML =
            `
            <div class="targetDayBox">
                <span class="monthDay">${curDay}</span>
                <span class="month">${months[curMonth]}</span>
            </div>
            <div class="addInfo">
                <div class="weekday">${weekdays[curWeekDay]}</div>
                <div class="fullDate">${String(curDay).padStart(2, '0')}.${String(curMonth).padStart(2, '0')}.${String(curYear)}</div>
            </div>
            <div class="containerBackground"></div>
            <span class="dayReminderLabel">${labels[labelIndex]}</span>
            `
        dropdownContent.appendChild(dBtnElement)
        if (curDay === curMonthLength) {
            curDay = 1
            if (curMonth + 1 === 13) {
                curMonth = 1
                curYear++
            } else {
                curMonth++
            }
        } else {
            curDay++
        }
        if (curWeekDay === 6) {
            curWeekDay = 0
        } else {
            curWeekDay++
        }
        labelIndex++
        if (labelIndex > 3) {
            dBtnElement.querySelector('.dayReminderLabel').remove()
            dBtnElement.classList.remove('labeled')
        }
        dynamicHeightFix()
        dayBtns = document.querySelectorAll(".dayBtn");
        dayBtns.forEach(e => {
            e.addEventListener("click", daysRadio)
        })
    }
}