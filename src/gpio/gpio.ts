var USE_MOCK = true;
var gpio;
if (process.platform === 'linux') {
    USE_MOCK = false;
    gpio = require('gpio');
}    


export function start() {
    if (USE_MOCK === true) {
	console.log(gpio);
    } else {
	console.log('PLATFORM DOES NOT SUPPORT GPIO:');
	console.log(process.platform);
    }

}