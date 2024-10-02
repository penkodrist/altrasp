let sTargets = document.querySelectorAll('[spa-target]')
let subjLoader = document.querySelector('[data-component-loader]')
let dateLoader = document.querySelector('[data-update-date-loader]')
let dateText = document.querySelector('[data-update-date]')
let noSubjFoundScreen = document.querySelector('.noSubjectsScreen')
let subjectSchedule = document.querySelector('.subjectSchedule')
let latestInfo = document.querySelector('.latestInfo')
let latestInfoHeightBuffer
latestInfoHeightBuffer = latestInfo.scrollHeight + 'px'
latestInfo.style.height = latestInfoHeightBuffer
let dateUpdateStatus = false
sTargets.forEach(e => {
    e.addEventListener("click", function () {
        if (e.classList.contains('toggled') === false) {
            dateUpdateStatus = e.getAttribute("spa-target") === "rb";
            spaEvent(e.getAttribute("spa-target"), dateUpdateStatus);
        } else {
            console.error('u-uh☝️☝️☝️')
        }
    })
})

function spaEvent (target, type) {
    if (type === 'goodboy') {
        document.querySelector('.return').textContent = 'Хороший мальчик))'
        document.querySelector('.return').style.pointerEvents = 'none'
        setTimeout(() => {
            subjectSchedule.style.opacity = '0'
            subjLoader.style.opacity = '1'
            dateText.style.opacity = '0'
            dateLoader.style.opacity = '1'
            if (type === true) {
                latestInfo.style.opacity = '0'
                latestInfo.style.height = '0px'
                latestInfo.style.marginTop = '0px'
            } else {
                latestInfo.style.opacity = '1'
                latestInfo.style.marginTop = ''
                latestInfo.style.height = latestInfoHeightBuffer
            }
            setTimeout(() => { spaChange(target) }, 250)
        }, 2000)
        return
    }
    subjectSchedule.style.opacity = '0'
    subjLoader.style.opacity = '1'
    dateText.style.opacity = '0'
    dateLoader.style.opacity = '1'
    if (type === true) {
        latestInfo.style.opacity = '0'
        latestInfo.style.height = '0px'
        latestInfo.classList.add('hidden')
    } else {
        latestInfo.style.opacity = '1'
        latestInfo.style.height = latestInfoHeightBuffer
        latestInfo.classList.remove('hidden')
    }
    setTimeout(() => { spaChange(target) }, 250)
}

function spaChange (target) {
    subjectSchedule.innerHTML = ''
    fetch(`/api/spa?target=${target}`, {
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