var mkpath = require('mkpath');
var rimraf = require('rimraf');


global.fs = require('fs');
global.assert = require('assert');
global.filedb = require('../index.js');
global.path = './test/files/';
global.path2 = path + 'newdir/';
global.instance = new filedb({
    dir: path
});
global.instance2 = new filedb({
	dir: path2
});
global.instanceNoPath = new filedb({
    dir: path + 'wrongpath/'
});


global.createFile = function(filename, flag) {
    var fileid = instance._getFileid(JSON.stringify(filename));
    var filepath = instance._getFilepath(fileid, flag);
    mkpath.sync(instance._getPath(fileid));
    fs.writeFileSync(filepath, JSON.stringify(filename));
    return fileid;
};
global.createFilesDir = function(dirpath) {
    var path1 = dirpath || path;
    fs.mkdirSync(path1);
};
global.removeFilesDir = function(dirpath) {
    var path1 = dirpath || path;
    rimraf.sync(path1);
};
