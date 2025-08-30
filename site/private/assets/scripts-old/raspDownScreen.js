let isAvailable
let date = document.querySelector('.date')
let raspDownHint = document.querySelector('.raspDownHint')


function availCheck() {
    if (isAvailable === 'false') {
        date.classList.add('unavailable')
        date.addEventListener('mouseenter', showRaspDownHint)
        date.addEventListener('mouseleave', hideRaspDownHint)
        setTimeout(() => {
            date.classList.add('triggered')
        }, 250)
    } else {
        date.classList.remove('unavailable')
        date.removeEventListener('mouseenter', showRaspDownHint)
        date.removeEventListener('mouseleave', hideRaspDownHint)
        date.classList.remove('triggered')
    }
}

function showRaspDownHint() {
    raspDownHint.style.opacity = '1'
    raspDownHint.style.left = date.getBoundingClientRect().left + date.getBoundingClientRect().width / 2 - raspDownHint.getBoundingClientRect().width / 2
    raspDownHint.style.top = date.getBoundingClientRect().top - raspDownHint.scrollHeight - 10
}

function hideRaspDownHint() {
    raspDownHint.style.opacity = '0'
}

