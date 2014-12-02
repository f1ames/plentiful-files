describe('filedb', function() {

    var fileid1, fileid2, fileid3,
        filename1 = 'testfile1r',
        filename2 = 'testfile2r',
        filename3 = 'testfile3r';

    beforeEach(function() {
        createFilesDir(); 
        fileid1 = createFile(filename1);
        fileid2 = createFile(filename2, instance.FLAG_NEW);
        fileid3 = createFile(filename3, instance.FLAG_UPDATED);
    });


    describe('#read()', function() {
        it('should throw error when there is no file', function(done) {
            assert.throws(
                instance.read('nofile', function(err, data) {
                    done();
                }), Error, /not exists/);
        });

        it('should return content of exisiting file', function(done) {
            instance.read(fileid1, function(err, data) {
                assert.strictEqual(filename1, data);
                done();
            });
        });

        it('should return content of exisiting new file', function(done) {
            instance.read(fileid2, function(err, data) {
                assert.strictEqual(filename2, data);
                done();
            });
        });

        it('should return content of exisiting updated file', function(done) {
            instance.read(fileid3, function(err, data) {
                assert.strictEqual(filename3, data);
                done();
            });
        });
    });

    describe('#read() - markAsViewed', function() {
        it('should remove new flag after read', function(done) {
            var filepath = instance._getFilepath(fileid2);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);

            instance.read(fileid2, function(err, data) {
                assert.strictEqual(fs.existsSync(filepath), true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);
                done();
            });
        });

        it('should remove updated flag after read', function(done) {
            var filepath = instance._getFilepath(fileid3);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);

            instance.read(fileid3, function(err, data) {
                assert.strictEqual(fs.existsSync(filepath), true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);
                done();
            });
        });

        it('should not remove new flag after read when markAsViewed = false', function(done) {
            var filepath = instance._getFilepath(fileid2);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);

            instance.read(fileid2, function(err, data) {
                assert.strictEqual(fs.existsSync(filepath), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
                done();
            }, false);
        });

        it('should not remove new flag after read when markAsViewed = false', function(done) {
            var filepath = instance._getFilepath(fileid3);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);

            instance.read(fileid3, function(err, data) {
                assert.strictEqual(fs.existsSync(filepath), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);
                done();
            }, false);
        });
    });


    afterEach(function() {
        removeFilesDir();
    });

});
