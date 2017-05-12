const request = require('request')
const { JSDOM } = require('jsdom')
const config = require('./config')

function sendMessage(text) {
    // Text Only!
    if (!text) {
        return
    }

    const URL = `https://api.telegram.org/bot${config.telegram.bot.id}:${config.telegram.bot.token}/sendMessage`
    request.post({
        url: URL,
        json: {
            "chat_id": config.telegram.receiver,
            "text": text
        }
    })
}

function parseKRX(bizNo, callback) {
    const URL = `http://kind.krx.co.kr/listinvstg/listinvstgcom.do?method=searchListInvstgCorpDetail&bizProcNo=${bizNo}`

    JSDOM.fromURL(URL).then((dom) => {
        const corp = dom.window.document.querySelector("table.detail").querySelector(".first td").textContent.trim()
        const progress = dom.window.document.querySelectorAll("section.type-99 li.active code")
        let text = corp + " IPO 심사 진행상황\n"

        progress.forEach((value) => {
            text += value.getAttribute("title") + "\n"
        })

        callback(text)
    })
}

function main() {
    parseKRX(config.bizNo, (text) => {
        sendMessage(text)
    })
}

main()
