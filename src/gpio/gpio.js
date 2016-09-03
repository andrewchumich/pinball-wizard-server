"use strict";
var USE_MOCK = true;
var gpio;
if (process.platform === 'linux') {
    USE_MOCK = false;
    gpio = require('gpio');
}
function start() {
    console.log(gpio);
    console.log('PLATFORM DOES NOT SUPPORT GPIO:');
    console.log(process.platform);
}
exports.start = start;
