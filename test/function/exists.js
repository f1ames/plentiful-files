describe('filedb', function() {

    var fileid1, fileid2, fileid3, fileid4;

    before(function() {
        createFilesDir();
        fileid1 = createFile('testfile1e');
        fileid2 = createFile('testfile2e', instance.FLAG_NEW);
        fileid3 = createFile('testfile3e', instance.FLAG_UPDATED);
        fileid4 = createFile('testfile4e', '.invalid');
    });


    describe('#exists()', function() {
        it('should return false when there is no file', function(done) {
            instance.exists('nofile', function(exists, err, fileinfo) {
                assert.strictEqual(exists, false);
                done();
            });
        });

        it('should return false when filename empty', function(done) {
            instance.exists(undefined, function(exists, err, fileinfo) {
                assert.strictEqual(exists, false);
                done();
            });
        });

        it('should return true when file exists', function(done) {
            instance.exists(fileid1, function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return true when file(.new) exists', function(done) {
            instance.exists(fileid2, function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return true when file(.updated) exists', function(done) {
            instance.exists(fileid3, function(exists, err, fileinfo) {
                assert.strictEqual(exists, true);
                done();
            });
        });

        it('should return false when there is file but with wrong flag', function(done) {
            instance.exists(fileid4, function(exists, err, fileinfo) {
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
            instance.exists(fileid1, function(exists, err, fileinfo) {
                assert.notStrictEqual(fileinfo.file, undefined);
                assert.notStrictEqual(fileinfo.path, undefined);
                assert.notStrictEqual(fileinfo.isNew, undefined);
                assert.notStrictEqual(fileinfo.isUpdated, undefined);
                assert.notStrictEqual(fileinfo.rawPath, undefined);
                done();
            });
        });

        it('should return fileinfo object with isNew === false, isUpdated === false for normal file', function(done) {
            instance.exists(fileid1, function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, false);
                assert.strictEqual(fileinfo.isUpdated, false);
                done();
            });
        });

        it('should return fileinfo object with isNew === true, isUpdated === false for new file', function(done) {
            instance.exists(fileid2, function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, true);
                assert.strictEqual(fileinfo.isUpdated, false);
                done();
            });
        });

        it('should return fileinfo object with isNew === false, isUpdated === true for updated file', function(done) {
            instance.exists(fileid3, function(exists, err, fileinfo) {
                assert.strictEqual(fileinfo.isNew, false);
                assert.strictEqual(fileinfo.isUpdated, true);
                done();
            });
        });
    });


    after(function() {
        removeFilesDir();
    });

});
