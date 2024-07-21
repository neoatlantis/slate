let browser = null;
if(globalThis.chrome) browser = globalThis.chrome;
else browser = globalThis.browser;

export default browser;
