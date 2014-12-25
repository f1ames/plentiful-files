# plentiful-files [![Build Status](https://travis-ci.org/f1ames/plentiful-files.svg?branch=master)](https://travis-ci.org/f1ames/plentiful-files)

Async library for managing big sets of files. Implements 5 only needed functions for file managment: exists, read, write, unlink, list.


## Installation

    npm install plentiful-files


## Usage

Set up:

    var pf = require('plentiful-files');
    var pfInstance = new pf({
        prefix: 'PF',
        dir: './myfiles/'
    });

Exists:

    pfInstance.exists(fileid, function(exists, err) {
        ...
    });

Read:

    pfInstance.read(fileid, function(err, data) {
        ...
    });

    pfInstance.read(fileid, function(err, data) {
        ...
    }, false);

