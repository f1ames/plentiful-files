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

    describe('#read()', function() {
        it('should throw error when there is no file', function(done) {
            assert.throws(
                instance.read('nofile', function(err, data) {
                    done();
                }), Error, /not exists/);
        });

        it('should return content of exisiting file', function(done) {
            instance.read('testfile1', function(err, data) {
                assert.equal('testfile1\n', data);
                done();
            });
        });

        it('should return content of exisiting new file', function(done) {
            instance.read('testfile2', function(err, data) {
                assert.equal('testfile2\n', data);
                done();
            });
        });

        it('should return content of exisiting updated file', function(done) {
            instance.read('testfile3', function(err, data) {
                assert.equal('testfile3\n', data);
                done();
            });
        });
    });

    describe('#read() - markAsViewed', function() {
        it('should remove new flag after read', function(done) {
            assert(fs.existsSync('./test/files/testfile2' + instance.FLAG_NEW), false);

            // instance.read('testfile2', function(err, data) {
            //     assert(fs.existsSync('./test/files/testfile2'), true);
            //     assert(fs.existsSync('./test/files/testfile2' + instance.FLAG_NEW), false);
            //     done();
            // });
        });
    });
});
