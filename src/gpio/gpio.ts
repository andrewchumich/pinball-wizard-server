var USE_MOCK = true;
if (process.platform === 'linux') {
    USE_MOCK = false;
}    


export function start() {
    if (USE_MOCK === true) {
	console.log(rpio);
    } else {
	console.log('PLATFORM DOES NOT SUPPORT GPIO:');
	console.log(process.platform);
    }

}