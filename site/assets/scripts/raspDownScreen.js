let isAvailable
let raspDownScreen = document.querySelector('.raspDownScreen')
let raspDownWrapper = document.querySelector('.raspDownWrapper')
let closeRaspDownBtn = document.querySelector('.closeRaspDownBtn')
fetch('/api/status')
    .then(res => res.text())
    .then(data => isAvailable = data)
    .then(availCheck)

function availCheck() {
    if (isAvailable === 'false') {
        raspDownScreen.style.opacity = '1'
        raspDownScreen.style.pointerEvents = 'auto'
        closeRaspDownBtn.addEventListener('click', () => {
            raspDownScreen.style.opacity = '0'
            raspDownWrapper.style.transform = 'scale(0.95)'
            setTimeout(() => {
                raspDownScreen.remove()
            }, 250)
        })
    } else if (isAvailable === 'true' || isAvailable === "") {
        raspDownScreen.remove()
    }
}

