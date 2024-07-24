const originalConsoleLog = console.log;
const fs = require('fs');

const emojiMap = JSON.parse(fs.readFileSync("./sandbox/emojis.json"))

console.log = (...args) => {
    args = args.map(argument => {
        if (typeof argument === "string") {
            const emojis = argument.match(/<-(.*?)->/g);
            emojis.forEach(emoji => {
                const regex = new RegExp("<-", "g");
                const occurances = (emoji.match(regex) || []).length;
                if (occurances > 1) {
                    throw new Error("One of the console.log strings contains nested emoji tags, please fix this");
                } else {
                    argument = argument.replace(emoji, emojiMap[emoji.replace("<-", "").replace("->", "")])
                }
            })
        }
        return argument
    })
    originalConsoleLog(...args);
}

module.exports = console.log
//console.log("i am hangri")