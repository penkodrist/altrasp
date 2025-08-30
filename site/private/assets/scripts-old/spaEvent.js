let sTargets = document.querySelectorAll('[spa-target]')
let subjLoader = document.querySelector('[data-component-loader]')
let dateLoader = document.querySelector('[data-update-date-loader]')
let dateText = document.querySelector('[data-update-date]')
let subjectSchedule = document.querySelector('.subjectSchedule')
let latestInfo = document.querySelector('.latestInfo')
let latestInfoHeightBuffer
latestInfoHeightBuffer = latestInfo.scrollHeight + 'px'
latestInfo.style.height = latestInfoHeightBuffer
let dateUpdateStatus = false
let chgr = localStorage.getItem('chgr')
sTargets.forEach(e => {
    e.addEventListener("click", function () {
        if (e.classList.contains('toggled') === false) {
            dateUpdateStatus = e.getAttribute("spa-target") === "rb";
            spaEvent("essential", e.getAttribute("spa-target"));
        }
    })
})

function spaEvent (chgr, target) {
    setTimeout(() => {
        fetch('/api/status', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(res => res.text())
            .then(data => isAvailable = data)
            .then(availCheck)
    }, 1000)
    subjectSchedule.style.opacity = '0'
    subjLoader.style.opacity = '1'
    dateText.style.opacity = '0'
    dateLoader.style.opacity = '1'
    if (chgr === 'essential') {
        latestInfo.style.opacity = '0'
        latestInfo.classList.add('hidden')
        latestInfo.style.height = '0px'
    } else {
        latestInfo.style.opacity = '1'
        latestInfo.classList.remove('hidden')
        latestInfo.style.height = latestInfoHeightBuffer
    }
    setTimeout(() => { spaChange(chgr, target) }, 250)
}

function spaChange (chgr, target) {
    subjectSchedule.innerHTML = ''
    fetch(`/api/spa?chgr=${chgr}&target=${target}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
        .then(res => res.json())
        .then(data => {
            subjectSchedule.style.opacity = '1'
            subjLoader.style.opacity = '0'
            dateText.style.opacity = '1'
            dateLoader.style.opacity = '0'
            subjectSchedule.innerHTML = data.html
            dateText.innerText = data.updateDate
        })
}