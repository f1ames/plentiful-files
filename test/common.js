var mkpath = require('mkpath');
var rimraf = require('rimraf');


global.fs = require('fs');
global.assert = require('assert');
global.filedb = require('../filedb.js');
global.path = './test/files/';
global.instance = new filedb({
    dir: path
});
global.instanceNoPath = new filedb({
    dir: path + 'wrongpath/'
});


global.createFile = function(filename, flag) {
    var fileid = instance._getFileid(filename);
    var filepath = instance._getFilepath(fileid, flag);    
    mkpath.sync(instance._getPath(fileid));
    fs.writeFileSync(filepath, filename);
    return fileid;
};
global.createFilesDir = function(filename) {
    fs.mkdirSync(path);
};
global.removeFilesDir = function(filename) {
    rimraf.sync(path);
};
