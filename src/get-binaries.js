const download = require('download');
const process = require('process');

const BIN_DIR = './bin';

function fail(msg) {
    console.error("ERROR: " + msg);
    process.exit(1);
}

// check platform
if (process.platform === 'win32') {

    const URL_FLATC_WIN = 'https://github.com/google/flatbuffers/releases/download/v1.9.0/flatc_windows_exe.zip';

    // download and extract Windows binaries
    download(URL_FLATC_WIN, BIN_DIR, { extract: true }).then(() => {
        // done
    }).catch((err) => {
        fail("Failed to download flatc from " + URL_FLATC_WIN + ": " + err.message);
    });

} else {
    // TODO build from sources for non-windows platforms
    fail("This module currently only supports Windows");
}
