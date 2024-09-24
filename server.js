const colors = require('colors');
const express = require('express')
const axios = require('axios')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const fsp = require('fs').promises
const path = require('path')
const { SocksProxyAgent } = require('socks-proxy-agent')

let app = express()
let data = ''

let infoLabel = '[INFO]'.bgBlue.black
let errorLabel = '[ERROR]'.bgRed.black
let successLabel = '[SUCCESS]'.bgGreen.black

let dom, dBTBody, subjRow
let subjNum, subjName, subjAuditory, subjTeacher, subjGroup
let curTd
let subjectsArray = {}
let rowIndex = 0
let dateIndex
let prevDateIndex
let tableHeaders = [ 'Пара', 'Предмет', 'Аудитория', 'Преподаватель', 'Подгруппа' ]
let weekdays = [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда',  'Четверг', 'Пятница', 'Суббота' ]

let formedData = ``
let processedData = ``

let newDate
let updateDate
fsp.readFile(path.join(__dirname, `updateDate.txt`), 'utf8').then(data => updateDate = data)

let isAvailable

let reqHTML
let resData

// ---------------------------------------------------------------------- //

// Main variables for parsing

// proxy: socks5://zXhBvW:CBKHfx@88.218.73.128:9426
// default: https://bincol.ru/rasp/view.php?id=00301

let targetUrl = 'https://bincol.ru/rasp/view.php?id=00301'
let connectionInterval = 300000
let axiosTimeout = 40000
let serverPort = 3000
let socksUrl = 'socks5://zXhBvW:CBKHfx@88.218.73.128:9426'

// ---------------------------------------------------------------------- //

const agent = new SocksProxyAgent(socksUrl)
const axiosInstance = axios.create({
    httpsAgent: agent,
    httpAgent: agent,
    proxy: false,
})

app.use(express.static('site'));

console.log(infoLabel, "Server started")

app.listen(serverPort, function () {
    console.log(successLabel, 'Server successfully started on port: ' + String(serverPort).bold)
})

const checkValidity = (req, res, next) => {
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        next()
    } else {
        res.status(403).sendFile(path.join(__dirname, 'site', 'components', '403.html'))
    }
}

app.get('/api/spa', checkValidity, async (req, res) => {
    try {
        reqHTML = await fsp.readFile(path.join(__dirname, 'site', 'components', `${req.query.target}.html`), 'utf8')
        sendData()
    } catch (err) {
        console.log(errorLabel, `Client tried to make fetch(), but it was incorrect...? Aborted: ${req.ip}`)
        reqHTML = await fsp.readFile(path.join(__dirname, 'site', 'components', '404.html'), 'utf8')
        sendData()
    }
    function sendData() {
        resData = {
            html: reqHTML,
            updateDate: updateDate
        }
        res.send(resData)
    }
})
app.get('/api/status', checkValidity, (req, res) => {
    try {
        res.send(isAvailable)
    } catch (err) {
        console.log(errorLabel, `Incorrect GET was sent, aborted! IP-address of GET: ${req.ip}`)
    }
})

fetchSite(targetUrl).then((err) => {
    if (!err) {
        parseData(data).then(() => {
            formComponents()
        })
    }
})
setInterval(() => {
    fetchSite(targetUrl).then((err) => {
        if (!err) {
            parseData(data).then(() => {
                formComponents()
            })
        }
    })
}, connectionInterval)

async function fetchSite(url) {
    try {
        console.log(infoLabel, "Trying to receive HTML from:", url.green.underline)
        const response = await axiosInstance.get(url, {
            timeout: axiosTimeout
        })
        data = response.data
        isAvailable = true
        console.log(successLabel, 'Data received.')
    } catch (err) {
        isAvailable = false
        if (err) {
            console.log(errorLabel, 'Unknown error or proxy is unreachable. Error code:', err.code)
        } else if (err.code === "ETIMEDOUT") {
            console.log(errorLabel, 'Connection has timed out')
        }
        return err
    }
}
async function parseData(data) {
    dom = new JSDOM(data);
    const doc = dom.window.document
    dBTBody = doc.body.querySelector('table tbody')
    dBTBody.removeChild(dBTBody.querySelector('tr:nth-child(1)'))
    dBTBody.querySelectorAll('tr').forEach(tr => {
        tr.querySelectorAll('td').forEach(e => {
            for (let i = 0; i < tableHeaders.length; i++) {
                if (e.textContent === tableHeaders[i]) {
                    e.remove()
                }
            }
        })
    })
    dateIndex = new Date().getDay()
    dBTBody.querySelectorAll('tr').forEach(tr => {
        if (!(tr.querySelector('td') === null || tr.querySelector('td') === undefined)) {
            curTd = tr.querySelector('td')
        } else {
            return
        }
        if ((curTd.innerHTML).slice(13) === formDate(dateIndex)) {
            rowIndex = 0
            prevDateIndex = dateIndex
            subjectsArray[formDate(dateIndex)] = {}
            if (dateIndex === 6) {
                dateIndex = 0
            } else {
                dateIndex++
            }
        } else if (Array.from(tr.querySelectorAll('td')).length === 5) {
            subjRow = tr.querySelectorAll('td')
            subjNum = subjRow[0].textContent
            subjName = subjRow[1].textContent
            if (subjRow[2].textContent !== "") {
                subjAuditory = subjRow[2].textContent
            } else {
                subjAuditory = "дистант / не указано"
            }
            subjTeacher = subjRow[3].textContent
            if (subjRow[4].textContent !== "") {
                subjGroup = subjRow[4].textContent
            } else {
                subjGroup = "нет информации"
            }
            subjectsArray[formDate(prevDateIndex)] = {
                ...subjectsArray[formDate(prevDateIndex)],
                [rowIndex]: {
                    "subjNum": subjNum,
                    "subjName": subjName,
                    "subjAuditory": subjAuditory,
                    "subjTeacher": subjTeacher,
                    "subjGroup": subjGroup,
                }
            }
            rowIndex++
        }
    })
}
function formComponents() {
    dateIndex = new Date().getDay()
    newDate = new Date()
    updateDate = `${String(newDate.getDate()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(2, '0')}.${String(newDate.getFullYear())} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')} (GMT+3)`
    fs.writeFile(path.join(__dirname, 'updateDate.txt'), updateDate, (err) => {
        if (err) {
            console.log(errorLabel, 'Update date was not written:', err)
        } else {
            console.log(successLabel, 'Update date was successfully written')
        }
    })
    for (let i = 0; i < Object.keys(subjectsArray).length; i++) {
        formedData = ``
        processedData = ``
        for (let j = 0; j < Object.keys(subjectsArray[formDate(dateIndex)]).length; j++) {
            processedData =
                `
            <div class="scheduleSubjectItem">
                        <div class="subjectCounterSide">
                            <div class="subjectCounter-part1">${subjectsArray[formDate(dateIndex)][String(j)]["subjNum"]}</div>
                            <div class="subjectCounter-part2"></div>
                        </div>
                        <div class="subjectInfo">
                            <div class="subjectName">${subjectsArray[formDate(dateIndex)][String(j)]["subjName"]}</div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./assets/imgs/teacher.svg">
                                </div>
                                <div class="infoText">
                                    <div class="subjectInfoPartHeader">Преподаватель</div>
                                    <div class="subjectInfoPartDesc">${subjectsArray[formDate(dateIndex)][String(j)]["subjTeacher"]}</div>
                                </div>
                            </div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./assets/imgs/auditory.svg">
                                </div>
                                <div class="infoText">
                                    <div class="subjectInfoPartHeader">Аудитория</div>
                                    <div class="subjectInfoPartDesc">${subjectsArray[formDate(dateIndex)][String(j)]["subjAuditory"]}</div>
                                </div>
                            </div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./assets/imgs/group.svg">
                                </div>
                                <div class="infoText">
                                    <div class="subjectInfoPartHeader">Подгруппа</div>
                                    <div class="subjectInfoPartDesc" data-subject-group>${subjectsArray[formDate(dateIndex)][String(j)]["subjGroup"]}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            formedData = formedData + processedData
        }
        fs.writeFileSync(`./site/components/${i}.html`, formedData, (err) => {
            if (err) {
                console.log(errorLabel, 'File was not written: ', err)
            }
        })
        if (dateIndex === 6) {
            dateIndex = 0
        } else {
            dateIndex++
        }
    }
    console.log(successLabel, 'Fetch script ended, recorded updateDate:', `${updateDate}`.bold)
}
function formDate(index) {
    return `${weekdays[index]}`
}