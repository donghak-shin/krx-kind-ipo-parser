var config = require('./config');
var request = require('request');
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

function sendMessage(text) {
    // Text Only!
    if (!text) {
        return;
    }

    request.post({
        url: "https://api.telegram.org/bot" + config.telegram.bot.id + ":" + config.telegram.bot.token + "/sendMessage",
        json: {
            "chat_id": config.telegram.receiver,
            "text": text
        }
    });
}

function parseKRX(cb) {
    var url = "http://kind.krx.co.kr/listinvstg/listinvstgcom.do?method=searchListInvstgCorpDetail&bizProcNo=" + config.bizNo;

    JSDOM.fromURL(url).then(dom => {
        var corp = dom.window.document.querySelector("table.detail").querySelector(".first td").textContent.trim();
        var progress = dom.window.document.querySelectorAll("section.type-99 li.active code");

        var text = corp + " IPO 심사 진행상황\n";

        var len = progress.length;
        for (var i = 0; i < len; i++) {
            text += progress[i].getAttribute("title") + "\n";
        }

        cb(text);
    });
}

function main() {
    parseKRX(function (text) {
        if (text) {
            sendMessage(text);
        }
    });
}

main();
