var fs = require('fs');
var assert = require('assert');
var filedb = require('../filedb.js');

describe('filedb', function() {

    var instance = new filedb({
        dir: './test/files/'
    });
    var instanceNoPath = new filedb({
        dir: './test/wrongpath/'
    });


    beforeEach(function() {
        try {
            fs.renameSync('./test/files/testfile2', './test/files/testfile2' + instance.FLAG_NEW);
            fs.renameSync('./test/files/testfile3', './test/files/testfile3' + instance.FLAG_UPDATED);
        } catch(ex) {}
    });

    describe('#exists()', function() {
        it('should return false when there is no file', function(done) {
            instance.exists('nofile', function(exists, err, fileinfo) {
                assert.strictEqual(exists, false);
                done();
            });
        });

        it('should return true when file exists', function(done) {
            instance.exists('testfile1', function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return true when file(.new) exists', function(done) {
            instance.exists('testfile2', function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return true when file(.updated) exists', function(done) {
            instance.exists('testfile3', function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return false when there is file but with wrong flag', function(done) {
            instance.exists('testfile4', function(exists, err, fileinfo) {
                assert.strictEqual(exists, false);
                done();
            });
        });

        it('should return false when there is no dir', function(done) {
            instanceNoPath.exists('testfile1', function(exists, err, fileinfo) {
                assert.strictEqual(exists, false);
                done();
            });
        });
    });

    describe('#exists() - callback params', function() {
        it('should return null as fileinfo when there is no file', function(done) {
            instance.exists('nofile', function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo, null);
                done();
            });
        });

        it('should return fileinfo object with file, path, isNew, isUpdated, rawPath fields', function(done) {
            instance.exists('testfile1', function(exists, err, fileinfo) {
                assert.notStrictEqual(fileinfo.file, undefined);
                assert.notStrictEqual(fileinfo.path, undefined);
                assert.notStrictEqual(fileinfo.isNew, undefined);
                assert.notStrictEqual(fileinfo.isUpdated, undefined);
                assert.notStrictEqual(fileinfo.rawPath, undefined);
                done();
            });
        });

        it('should return fileinfo object with isNew === false, isUpdated === false for normal file', function(done) {
            instance.exists('testfile1', function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, false);
                assert.strictEqual(fileinfo.isUpdated, false);
                done();
            });
        });

        it('should return fileinfo object with isNew === true, isUpdated === false for new file', function(done) {
            instance.exists('testfile2', function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, true);
                assert.strictEqual(fileinfo.isUpdated, false);
                done();
            });
        });

        it('should return fileinfo object with isNew === false, isUpdated === true for updated file', function(done) {
            instance.exists('testfile3', function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, false);
                assert.strictEqual(fileinfo.isUpdated, true);
                done();
            });
        });

    });

    // afterEach(function() {
    // });
});
