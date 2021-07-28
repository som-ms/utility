const fs = require('fs')
var myargs = process.argv.slice(2);
var totalChannels = Number(myargs[0]);
var totalSubscribers = Number(myargs[1]);
var channelsPerSubscriber = Number(myargs[2])

var myMap = new Map();
assignChannels(totalChannels, totalSubscribers, channelsPerSubscriber)
function assignChannels(totalChannels, totalSubscribers, channelsPerSubscriber) {
    for (var i = 0; i < totalSubscribers; i++) {
        if (i == (totalSubscribers - 1)) {  // adjust channels that have not been included in any case
            createFile(i + 1, totalChannels, channelsPerSubscriber, true);
        } else {
            createFile(i + 1, totalChannels, channelsPerSubscriber, false);
        }
    }
}

function createFile(fileIndex, totalChannels, channelsPerSubscriber, isLast) {
    var mySet = new Set();
    if (isLast) {
        // adjust remaining numbers
        var remSet = getRemaining(totalChannels);
        for (var x of remSet) {
            mySet.add(Number(x));
            myMap.set(Number(x), 1);
            console.log(x);
        }
        if (mySet.size > channelsPerSubscriber) {
            console.log("PROCESS FAILED....RUN AGAIN..!!")
        }
        console.log("rem set size: " + mySet.size);
    }
    while (mySet.size < channelsPerSubscriber) {
        var num = getValidNumber(totalChannels);
        if (myMap.has(num)) {
            var val = myMap.get(num);
            val++;
            myMap.set(num, val);
        } else {
            myMap.set(num, 1);
        }
        mySet.add(num);
    }
    var str = Array.from(mySet).join(',');
    // console.log(str);
    fs.writeFileSync('./files/file' + fileIndex + '.txt', str);
}

function getRemaining(totalChannels) {
    var remSet = new Set();
    for (var x = 1; x <= totalChannels; x++) {
        if (!myMap.has(x)) {
            remSet.add(x);
        }
    }
    return remSet;
}

function getValidNumber(totalChannels) {
    var num = getRandom(totalChannels);
    while (!isValid(num)) {
        num = getRandom(totalChannels);
    }
    return num;
}

function getRandom(max) {
    return Math.floor(Math.random() * (max + 1));
}

function isValid(num) {
    var isValid = true;
    if (myMap.has(num) && myMap.get(num) >= 10) {
        isValid = false;
    }
    return isValid;
}