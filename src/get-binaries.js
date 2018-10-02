/******************************************************************************/
/*!
	\module    : get-binaries.js
	\project   : flatc-js (https://github.com/dapaulid/flatc-js)
    \author    : Daniel Pauli
	\date      : 2018-10-02
	\language  : JavaScript
	\platform  : Node.js
*/
/******************************************************************************/

//------------------------------------------------------------------------------
// imports
//------------------------------------------------------------------------------

// node
const fs = require('fs');
const path = require('path');
const process = require('process');
const child_process = require('child_process');

// external
const download = require('download');
const rimraf = require('rimraf');

// app
const pkginfo = require('../package.json');


//------------------------------------------------------------------------------
// constants
//------------------------------------------------------------------------------

const BIN_DIR = './bin';
const VERSION_PLACEHOLDER = '${version}';


//------------------------------------------------------------------------------
// helpers
//------------------------------------------------------------------------------

function exec(command, args, cwd) {
    const ret = child_process.spawnSync(command, args || [], { stdio: 'inherit', cwd });
    if (ret.error) {
        // failed to run process
        if (ret.error.errno == 'ENOENT') {
            fail(command + " not found, make sure it is installed.")
        } else {
            fail(ret.error.toString());
        }
    } else if (ret.status !== 0) {
        // process failed
        let msg = command + " failed with code " + ret.status + ".";
        
        // try to give some additional hints
        if (command == "cmake") {
            msg += " Make sure you have g++ installed.";
        }

        fail(msg);
    }
}

//------------------------------------------------------------------------------

function fail(msg) {
    console.error("ERROR: " + msg);
    process.exit(1);
}


//------------------------------------------------------------------------------
// main
//------------------------------------------------------------------------------

// delete existing binaries
rimraf.sync(BIN_DIR);

// check platform
if (process.platform === 'win32') {

    // download and extract Windows binaries
    const url = pkginfo.flatc.win32_bin_url.replace(VERSION_PLACEHOLDER, pkginfo.flatc.version);
    download(url, BIN_DIR, { extract: true }).then(() => {
        // done
    }).catch((err) => {
        fail("Failed to download flatc from " + url + ": " + err.message);
    });

} else {

    // download and extract sources
    const url = pkginfo.flatc.src_url.replace(VERSION_PLACEHOLDER, pkginfo.flatc.version);
    download(url, BIN_DIR, { extract: true }).then(() => {

        // determine build directory
        const buildDir = path.join(BIN_DIR, "flatbuffers-" + pkginfo.flatc.version) 

        // based on https://google.github.io/flatbuffers/md__building.html

        // configure
        exec("cmake", ["-G", "Unix Makefiles"], buildDir);
        // build
        exec("make", ["flatc"], buildDir);
        // install
        fs.copyFileSync(path.join(buildDir, "flatc"), path.join(BIN_DIR, "flatc"));

        // cleanup
        rimraf.sync(buildDir);

    }).catch((err) => {
        fail("Failed to build flatc from " + url + ": " + err.message);
    });
    
}


//------------------------------------------------------------------------------
// end of file

