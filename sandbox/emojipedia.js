const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

(async() => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: false,
        //args: ["--start-fullscreen", "--start-maximized"]
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);
    const emojiNames = JSON.parse(fs.readFileSync("emojis.json")).emojiNames;
    //console.log(emojiNames)
    let count = 0
    async function main() {
        let name = emojiNames[count].replace(/keycap: /g, "keycap-digit-").replace(/: /g, "-").replace(/ /g, "-").toLowerCase().replace(/w/g, "");
        //console.log(name)
        await page.goto(`https://emojipedia.org/microsoft-3D-fluent/fluent-15.0/${name}`);
        try  {
            const notFoundSelector = page.waitForSelector(`::-p-xpath(//h1[text()="Not Found"])`, { visible: true });
            const emojiHeadingSelector = page.waitForSelector(`::-p-xpath(//h1[contains(text(), "Microsoft 3D Fluent 15.0")])`, { visible: true });
            await Promise.race([notFoundSelector, emojiHeadingSelector]);
            console.log("One of the selectors appeared!");
            await delay(500);
        } catch (err) {
            console.log(`Error with selectors for name ${name}`);
        }
        console.log("reached")
        const notFoundSelector = await page.$(`::-p-xpath(//h1[text()="Not Found"])`);
        //const emojiHeadingSelector = await page.$()
        if (notFoundSelector == null) {
            console.log("reached again??")
            const imageUrl = await page.evaluate(() => {
                return document.evaluate('//*[@id="__next"]/div/main/div[1]/div/section/div/div[1]/div[1]/div/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src;
            });
            const emojiHeadingSelector = await page.$("#__next > div > main > div.Container_container-wrapper__u0gtd > div > section > div > h1");
            let emoji = await (await emojiHeadingSelector.getProperty("textContent")).jsonValue();
            emoji = emoji.trim()[0];
            console.log([emoji.replace(/\{([^}]*)\}/g, (_, g) => String.fromCodePoint(`0x${g}`)), imageUrl]);
            console.log("down here")
            //console.log("success here")
        }
        count++;
        main();
    }
    main();
})();