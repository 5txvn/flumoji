const fs = require('fs');

const emojiNames = JSON.parse(fs.readFileSync("./sandbox/emojis.json")).emojiNames;

emojiNames.forEach(emoji => {
    if (emoji.charAt(0) == "f" && !emoji.includes("flag")) {
        console.log(emoji);
    }
})