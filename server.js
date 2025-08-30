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

let infoLabel = `[ INFO ]`.bgBlue.black
let errorLabel = `[ ERROR ]`.bgRed.black
let successLabel = `[ SUCCESS ]`.bgGreen.black
let statusLabel = `[ STATUS ]`.bgYellow.black
function consoleLog(errorType, message) {
    let logsDate = new Date()
    let logDateString = `${String(logsDate.getDate()).padStart(2, '0')}.${String(logsDate.getMonth() + 1).padStart(2, '0')}.${String(logsDate.getFullYear())} ${String(logsDate.getHours()).padStart(2, '0')}:${String(logsDate.getMinutes()).padStart(2, '0')}:${String(logsDate.getSeconds()).padStart(2, '0')}`
    console.log(`[ ${logDateString.bold} ] ${errorType} ${message}`)
}

let dom, doc, dBTBody, subjRow
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

let isAvailable

let reqHTML
let resData
let chgrValidity

let targetUrl = ''
let connectionInterval = 10000000
let axiosTimeout = 999
let serverPort = 3000
let socksUrl = 'socks5://127.0.0.1:2080'
let cyclesIndex = 0
let gid
let gJSONData

const agent = new SocksProxyAgent(socksUrl)
const axiosInstance = axios.create({
    httpsAgent: agent,
    httpAgent: agent,
    proxy: false,
})

app.use('/private', checkReferer, express.static(path.join(__dirname, 'private')));
function checkReferer(req, res, next) {
    const referer = req.get('Referer');
    if (!referer) {
        return res.redirect('/')
    }
    next();
}
app.use('/downloadables', (req, res, next) => {
    const referer = req.get('Referer');
    if (!referer) {
        consoleLog(errorLabel, 'Referer header was not found, somebody tried to get access to files with URL')
        return res.status(403).sendFile(path.join(__dirname, 'site', 'private', 'components', '403.html'));
    }
    next();
});
app.use(express.static('site'));
app.use((req, res, next) => {
    consoleLog(statusLabel, `IP: ${String((req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()).bold} | UserAgent: ${String(req.headers['user-agent']).bold}`)
    next()
})
consoleLog(infoLabel, "Server started")
app.listen(serverPort, function () {
    // consoleLog(successLabel, `Server successfully started on port: ${String(serverPort).bold}`)
})
const checkValidity = (req, res, next) => {
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        next()
    } else {
        res.status(403).sendFile(path.join(__dirname, 'site', 'private', 'components', '403.html'))
    }
}
app.get('*', async (req, res, next) => {
    let isErr
    if (!(req.headers['x-requested-with'] === 'XMLHttpRequest')) {
        await fsp.readFile(`${path.join(__dirname, 'site') + req.url}`).catch(err => isErr = err)
    }
    if (req.url === '/app') { isErr = null }
    if (isErr) {
        res.redirect('/')
    } else {
        next()
    }
})
app.get('/api/spa', checkValidity, async (req, res) => {
    try {
        chgrValidity = ''
        reqHTML = await fsp.readFile(path.join(__dirname, 'site', 'private', 'components', String(req.query.chgr), `${req.query.target}.html`), 'utf8')
        if (String(req.query.chgr) !== 'essential') {
            updateDate = await fsp.readFile(path.join(__dirname, 'site', 'private', 'components', String(req.query.chgr), 'updateDate.txt'), 'utf8')
        }
        sendData()
    } catch (err) {
        consoleLog(errorLabel, `Incoming SPA request is invalid. Aborted: ${err}`)
        reqHTML = await fsp.readFile(path.join(__dirname, 'site', 'private', 'components', '404.html'), 'utf8')
        chgrValidity = 'invalid'
        sendData()
    }
    function sendData() {
        resData = {
            html: reqHTML,
            updateDate: updateDate,
            chgrValidity: chgrValidity
        }
        res.send(resData)
    }
})
app.get('/api/status', checkValidity, (req, res) => {
    try {
        res.send(isAvailable)
    } catch (err) {
        consoleLog(errorLabel, `Incorrect GET was sent, aborted! IP-address of GET: ${req.ip}`)
    }
})
app.get('/api/groups-legacy', checkValidity, async (req, res) => {
    try {
        res.send(await fsp.readFile(path.join(__dirname, 'site', 'private', 'components', 'groups.html'), 'utf8'))
    } catch (err) {
        consoleLog(errorLabel, `Error when trying to read groups list or someone tried to send GET request without header. Server is shut down: ${err}`)
        process.exit()
    }
})
app.get('/api/checkChgrNameValidity', checkValidity, async (req, res) => {
    try {
        let parsedJson
        let chgrID = req.query.chgr
        let chgrNAME = req.query.chgrName
        let fixedData
        try {
            await fsp.readFile('bincol_groups.json', 'utf8').then(data => {
                parsedJson = JSON.parse(data)
                if (parsedJson[chgrID] !== chgrNAME) {
                    throw err
                }
            })
        } catch (err) {
            fixedData = {
                status: "invalid",
                fixedName: parsedJson[chgrID]
            }
            res.send(fixedData)
        }
    } catch (err) {
        consoleLog(errorLabel, `Error checking CHGR validity. Either file cannot be read or requested object was not found in JSON: ${err}`)
    }
})
app.get('/api/groups', checkValidity, async (req, res) => {
    res.send(await fsp.readFile(path.join(__dirname, 'bincol_groups.json'), 'utf8'))
})
app.get('/app', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'site', 'app.html'))
    } catch (err) {
        consoleLog(errorLabel, `Incorrect GET was sent, aborted! IP-address of GET: ${req.ip}`)
    }
})
readJsonTest().then((data) => {
    let doesExist
    gJSONData = data
    for (let i = 0; i <= Object.keys(JSON.parse(data)).length ; i++) {
        gid = Object.keys(JSON.parse(data))[i]
        try {
            doesExist = fs.existsSync(path.join(__dirname, 'site', 'private', 'components', gid))
            // consoleLog(infoLabel, `${String(gid).bold} already exists`)
        } catch (err) {
            if (!(String(err).startsWith('TypeError'))) {
                consoleLog(errorLabel, `Error when making directory ${gid}: ${err}`)
            }
        }
        if (!doesExist) {
            try {
                fs.mkdir(path.join(__dirname, 'site', 'private', 'components', gid), () => {})
                // consoleLog(infoLabel, `${String(gid).bold} - creating directory`)
            } catch (err) {
                if (!(String(err).startsWith('TypeError'))) {
                    consoleLog(errorLabel, `Error when making directory ${gid}: ${err}`)
                }
            }
        }
    }
}).then(formGroupsHtml)
async function readJsonTest() {
    return await fsp.readFile(path.join(__dirname, 'bincol_groups.json'), 'utf8')
}
function formGroupsHtml() {
    let formedGroups = ''
    for (let i = 0; i < Object.keys(JSON.parse(gJSONData)).length ; i++) {
        formedGroups += `<div class="sg-group" chgr="${Object.keys(JSON.parse(gJSONData))[i]}">${Object.values(JSON.parse(gJSONData))[i]}</div>`
    }
    fs.writeFile(path.join(__dirname, 'site', 'private', 'components', 'groups.html'), formedGroups, () => {})
}

setInterval(() => {
    if (cyclesIndex === 80) {
        cyclesIndex = 0
        consoleLog(infoLabel, `Parsing cycle has completed. Restarting the cycle.`)
    }
    gid = Object.keys(JSON.parse(gJSONData))[cyclesIndex]
    targetUrl = `https://bincol.ru/rasp/view.php?id=${gid}`
    // consoleLog(infoLabel, `Current cyclesIndex is ${String(cyclesIndex).bold}`)
    fetchSite(targetUrl).then((err) => {
        if (!err) {
            parseData(data, gid).then((err) => {
                if (!err) {
                    formComponents(gid)
                }
            })
        }
    })
    cyclesIndex++
}, connectionInterval)

async function fetchSite(url) {
    try {
        // consoleLog(infoLabel, `Trying to receive HTML from: ${url.green.underline}`)
        const response = await axiosInstance.get(url, {
            timeout: axiosTimeout
        })
        data = response.data
        isAvailable = true
        // consoleLog(successLabel, 'Data received.')
    } catch (err) {
        isAvailable = false
        if (err) {
            consoleLog(errorLabel, `Unknown error or proxy is unreachable. Error code: ${err.code}; Error: ${err}`)
        } else if (err.code === "ECONNABORTED") {
            consoleLog(errorLabel, 'Connection has timed out')
        }
        return err
    }
}
async function parseData(data, gidValue) {
    dom = new JSDOM(data);
    doc = dom.window.document
    dBTBody = doc.body.querySelector('table tbody')
    if (dBTBody === null) {
        consoleLog(errorLabel, `${String(gidValue).bold} - Caught data being null. Waiting next parse in 5 minutes.`)
        isAvailable = false
        return err = "err"
    }
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
    dom.window.close()
}
function formComponents(gidValue) {
    // consoleLog(infoLabel, `${String(gidValue).bold} - Writing new info to a group...`)
    dateIndex = new Date().getDay()
    for (let i = 0; i < Object.keys(subjectsArray).length; i++) {
        formedData = ``
        processedData = ``
        for (let j = 0; j < Object.keys(subjectsArray[formDate(dateIndex)]).length; j++) {
            processedData =
                `
            <div class="scheduleSubjectItem">
                        <div class="subjectCounterSide">
                            <div class="part1">${subjectsArray[formDate(dateIndex)][String(j)]["subjNum"]}</div>
                            <div class="part2"></div>
                        </div>
                        <div class="subjectInfo">
                            <div class="subjectName">${subjectsArray[formDate(dateIndex)][String(j)]["subjName"]}</div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./private/assets/imgs/teacher.svg">
                                </div>
                                <div class="infoText">
                                    <div class="subjectInfoPartHeader">Преподаватель</div>
                                    <div class="subjectInfoPartDesc">${subjectsArray[formDate(dateIndex)][String(j)]["subjTeacher"]}</div>
                                </div>
                            </div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./private/assets/imgs/auditory.svg">
                                </div>
                                <div class="infoText">
                                    <div class="subjectInfoPartHeader">Аудитория</div>
                                    <div class="subjectInfoPartDesc">${subjectsArray[formDate(dateIndex)][String(j)]["subjAuditory"]}</div>
                                </div>
                            </div>
                            <div class="subjectInfoPart">
                                <div class="infoIcon">
                                    <img alt="teacher" src="./private/assets/imgs/group.svg">
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
        if (formedData.length < 1) {
            formedData =
                `
                <div class="noSubjectsScreen">
                    <img alt="utya3" src="./private/assets/imgs/utya_confused.webp">
                    <div class="h1">Пар не было найдено</div>
                    <div class="h2">Возможно, данные пока не обновились</div>
                </div>
                `
        }
        fs.writeFileSync(`./site/private/components/${gidValue}/${i}.html`, formedData, (err) => {
            if (err) {
                consoleLog(errorLabel, `File was not written: ${err}`)
            }
        })
        if (dateIndex === 6) {
            dateIndex = 0
        } else {
            dateIndex++
        }
    }
    newDate = new Date()
    updateDate = `${String(newDate.getDate()).padStart(2, '0')}.${String(newDate.getMonth() + 1).padStart(2, '0')}.${String(newDate.getFullYear())}<br>${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}`
    fs.writeFile(`./site/private/components/${gidValue}/updateDate.txt`, updateDate, (err) => {
        if (err) {
            consoleLog(errorLabel, `${String(gidValue).bold} - Update date was not written: ${err}`)
        } else {
            consoleLog(successLabel, `${String(gidValue).bold} - Update date was successfully written: ${updateDate.bold}`)
        }
    })
    // consoleLog(successLabel, `${String(gidValue).bold} - Fetch script ended, recorded updateDate: ${updateDate.bold}`)
}
function formDate(index) {
    return `${weekdays[index]}`
}