/******************************************************************************/
/*!
	\module    : flatc.js
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
const path = require('path');
const child_process = require('child_process');

// externals
const optional = require('optional');

// optional externals
const glob = optional('glob');

//------------------------------------------------------------------------------
// constants
//------------------------------------------------------------------------------

const default_options = {
    language: "js",
    outputDir: null,
    genMutable: false,
    genObjectApi: false,
    genOnefile: false,
    genAll: false,
    noJsExports: false,
    googJsExport: false,
}

const FLATC_EXEC = path.normalize(__dirname + "/../bin/flatc");


//------------------------------------------------------------------------------
// API functions
//------------------------------------------------------------------------------

function flatc(inputFiles, options) {

    // use defaults for not specified options
    options = Object.assign({}, default_options, options);

    function run(inputFiles, resolve, reject) {
        // build command line arguments
        const args = [];
        // add generator options
        const languages = [].concat(options.language);
        for (const language of languages) {
            args.push('--' + language);
        }
        // add specific options
        if (options.outputDir) {
            args.push('-o');
            args.push(options.outputDir);
        }
        // add boolean properties as flags
        for (const [key, value] of Object.entries(options)) {
            if (value === true) {
                args.push(camelToFlag(key));
            }
        }
        // add input files
        for (const inputFile of inputFiles) {
            args.push(inputFile);
        }
        // run flatc command
        exec(FLATC_EXEC, args, (code, stdout, stderr) => {
            if (code === 0) {
                resolve();
            } else {
                const err = stderr[0] || stdout[0] || "unknown error";
                reject(err);
            }
        });
    }

    return new Promise((resolve, reject) => {
        // glob supported?
        if (glob && typeof inputFiles === 'string') {
            // yes -> use it to get file list
            glob(inputFiles, { nonull: true }, (err, matches) => {
                if (err) {
                    reject(err);
                } else {
                    run(matches, resolve, reject);
                }
            });
        } else {
            // no -> just pass the files we got
            run([].concat(inputFiles), resolve, reject);
        }
    });
}


//------------------------------------------------------------------------------
// helpers
//------------------------------------------------------------------------------

function exec(command, args, cb) {
    let stdout = "";
    let stderr = "";
    const proc = child_process.spawn(command, args);
    proc.stdout.on('data', (data) => stdout += data);
    proc.stderr.on('data', (data) => stderr += data);
    proc.on('close', function (code) {
        cb(code, stdout.split(/\r?\n/), stderr.split(/\r?\n/));
    });
}

//------------------------------------------------------------------------------

function isUpper(str) {
    return str === str.toUpperCase() && str !== str.toLowerCase();
}

//------------------------------------------------------------------------------

function camelToFlag(str) {
    if (!str) {
        return str;
    }
    let flag = "--";
    for (const ch of str) {
        if (isUpper(ch)) {
            flag += '-' + ch.toLowerCase();
        } else {
            flag += ch;
        }
    }
    return flag;
}


//------------------------------------------------------------------------------
// exports
//------------------------------------------------------------------------------

module.exports = flatc;


//------------------------------------------------------------------------------
// end of file

