//import required modules
const fs = require('fs');

//read the emojis file and whatever arguments come in on the command line
const emojis = JSON.parse(fs.readFileSync("./sandbox/emojis.json"));
const instance = process.argv[2];

//log whatever is recieved in the command line, set count to 0 an keep an empty emoji names array
console.log(instance)
let count = 0;
let emojiNames = []

// get emojis and get their codenames, counting the number of instances of a particular codename
Object.keys(emojis).forEach(emojiName => {
    const splitSpaces = emojiName.split("i");
    let codename = "";
    splitSpaces.forEach(splitSpace => {
        codename += splitSpace.charAt(0)
    })
    console.log(codename);
    if (codename === instance) {
        count++;
        emojiNames.push(emojiName)
    }
})

// this is the count for the emojis
console.log(count);
console.log(emojiNames)

