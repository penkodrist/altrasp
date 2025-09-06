let spaSubContainer = document.querySelector('.schedule')
let lastUpdateDate = document.querySelector('[data-last-update-date]')
let loadSpinner = document.querySelector('#loadSpinner')
let refreshBtn = document.querySelector('.scheduleUpdateBtn')
refreshBtn.addEventListener('click', scheduleUpdateEvent)
let rbBtn = document.querySelector('[data-action="schedule-calls"]')
rbBtn.addEventListener('click', spaEventUI)
let rdn = document.querySelector('.raspDownNotifContainer .notif')
let fetchDelay = null
let notifDelay = null
let activeTarget
function spaEvent(chgr, target, triggerNotif) {
    return new Promise(resolve => {
        spaSubContainer.classList.add('hidden')
        loadSpinner.style.opacity = '1'
        activeTarget = target
        // хандлер для особенных долбаебов которые захотят часто понажимать на "кнопочки :3"
        if (!fetchDelay) {
            fetchDelay = setTimeout(async () => innerFn(triggerNotif, resolve), 150)
        } else {
            clearTimeout(fetchDelay)
            fetchDelay = null
            fetchDelay = setTimeout(async () => innerFn(triggerNotif, resolve), 150)
        }
    })
    function innerFn(tN, resolve) {
        spaSubContainer.classList.add('hidden')
        loadSpinner.style.opacity = '1'
        const statusPromise = fetch('/api/status', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(res => res.text())
            .then(data => {
                if (data === 'false') {
                    lastUpdateDate.closest('.lastUpdateContainer').classList.add('unavailable')
                    if (tN) {
                        rdn.classList.add('show')
                    }
                    if (!notifDelay) {
                        notifDelay = setTimeout(() => rdn.classList.remove('show'), 3000)
                    } else {
                        clearTimeout(notifDelay)
                        notifDelay = null
                        notifDelay = setTimeout(() => rdn.classList.remove('show'), 3000)
                    }
                } else {
                    lastUpdateDate.closest('.lastUpdateContainer').classList.remove('unavailable')
                }
            })
        const spaPromise = fetch(`/api/spa?chgr=${chgr}&target=${target}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('fetch done')
                spaSubContainer.innerHTML = data.html;
                if (data.updateDate !== undefined) {
                    lastUpdateDate.innerHTML = data.updateDate
                } else {
                    lastUpdateDate.innerText = 'нет данных'
                }
                spaSubContainer.classList.remove('hidden')
                loadSpinner.style.opacity = '0'
            })
        Promise.all([statusPromise, spaPromise]).then(() => {
            resolve();
        });
    }
}
function spaEventUI(event) {
    if (event.target === rbBtn) {
        spaEvent('essential', 'rb')
        return
    }
    let chgr = localStorage.getItem('chgr')
    let target = event.currentTarget.getAttribute('data-target')
    spaEvent(chgr, target, false)
}
function scheduleUpdateEvent() {
    spaEvent(localStorage.getItem('chgr'), activeTarget, true)
}