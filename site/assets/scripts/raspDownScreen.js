let isAvailable
fetch('/api/status')
    .then(res => res.text())
    .then(data => isAvailable = data)
    .then(availCheck)

function availCheck() {
    if (isAvailable === 'false') {
        document.querySelector('.raspDownScreen').style.opacity = '1'
        document.querySelector('.closeRaspDownBtn').addEventListener('click', () => {
            document.querySelector('.raspDownScreen').style.opacity = '0'
            document.querySelector('.raspDownWrapper').style.transform = 'scale(0.95)'
            setTimeout(() => {
                document.querySelector('.raspDownScreen').remove()
            }, 250)
        })
    } else if (isAvailable === 'true' || isAvailable === "") {
        document.querySelector('.raspDownScreen').remove()
    }
}

