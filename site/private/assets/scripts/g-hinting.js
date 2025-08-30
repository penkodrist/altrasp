let allOptionsNames = document.querySelectorAll('[data-option-name]')
let gHintTarget = document.querySelector('[data-ghint]')
gHintTarget.addEventListener('click', gHintEvent)
function gHintEvent(event) {
    switch (event.currentTarget.getAttribute('data-ghint')) {
        case 'group':
            settingsPage.classList.add('active')
            mainPage.classList.add('hidden')
            allOptionsNames.forEach(e => {
                if (e.getAttribute('data-option-name') === event.currentTarget.getAttribute('data-ghint')) {
                    e.classList.add('outlined')
                    mainPage.classList.add('hidden')
                }
            })
            break
    }
}
function removeOutlining() {
    allOptionsNames.forEach(e => {
        e.removeEventListener('click', removeOutlining)
        e.classList.remove('outlined')
    })
}