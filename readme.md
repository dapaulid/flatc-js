# flatc.js
Node.js bindings for Google FlatBuffers compiler (https://github.com/google/flatbuffers).

## Purpose

This module provides a simple wrapper around Google FlatBuffers compiler (`flatc`) in order to make it usable in Node.js. 
The required binaries are either downloaded directly (Windows) or built from source (Linux) from the official release (https://github.com/google/flatbuffers/releases).

## Requirements

Under Linux, you need to have `cmake` and `g++` (or some other supported compiler) installed.

## Installation
```
npm install --save-dev flatc
```

## Usage
```javascript
const flatc = require('flatc');

flatc("monster.fbs", {
    language: ["js", "ts"],
    outputDir: "output",
}).then(() => {
    console.log("Done!");
}).catch(console.error);
```

## Options

The wrapper just passes through boolean properties as flags. For documentation see https://google.github.io/flatbuffers/flatbuffers_guide_using_schema_compiler.html.

```javascript
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
```
