let ddBtn = document.querySelector('.sBtn.dropdownBtn')
let dropdownContent = document.querySelector('.sContentDropdown .dropdownContent')
let sContentDropdown = document.querySelector('.sContentDropdown')
ddBtn.addEventListener('click', scheduleDDToggle)
dropdownContent.style.height = dropdownContent.scrollHeight + 'px'
function scheduleDDToggle() {
    if (dropdownContent.style.height !== '0px') {
        dropdownContent.style.height = '0px'
        sContentDropdown.classList.add('active')
    } else {
        dropdownContent.style.height = dropdownContent.scrollHeight + 'px'
        sContentDropdown.classList.remove('active')
    }
}
// использовать только при загрузке сайта и нажатии на кнопку "открыть остальные дни"
function dynamicHeightFix() {
    dropdownContent.style.height = dropdownContent.scrollHeight + 'px'
}