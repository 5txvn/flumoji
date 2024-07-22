const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const emojis = {
    emojiNames: []
};

(async() => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    const page = await browser.newPage();
    await page.goto("https://unicode-org.github.io/emoji/emoji/charts-13.1/emoji-list.html");
    console.log("went to page")
    //await page.waitForSelector("body > div.main > table > tbody > tr:nth-child(4) > td.name", { visible: true });
    await delay(5000)
    console.log("reached")
    //start the loop through the CLDR short names
    let rowsLeft = true;
    let count = 0;
    const shortNames = [];
    while(rowsLeft) {
        //body > div.main > table > tbody > tr:nth-child(12) > td:nth-child(4)
        //body > div.main > table > tbody > tr:nth-child(2071) > td:nth-child(4)
        let currentElement = await page.$(`body > div.main > table > tbody > tr:nth-child(${count}) > td:nth-child(4)`);
        if (currentElement != null) {
            const shortName = await (await currentElement.getProperty("textContent")).jsonValue();
            console.log(shortName.replace(/⊛/g, "").replace(/’/g, "").trim())
            shortNames.push(shortName.replace(/⊛/g, "").replace(/’/g, "").trim());
            emojis.emojiNames.push(shortName.replace(/⊛/g, "").replace(/’/g, "").trim())
            await currentElement.scrollIntoView({ behavior: "smooth" });
        }
        if (count == 2071) {
            fs.writeFileSync("./emojis.json", JSON.stringify(emojis))
            rowsLeft = false;
        }
        count++
    }
    console.log(shortNames)
})();