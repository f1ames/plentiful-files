describe('filedb', function() {

    var fileid1, fileid2, fileid3,
        filedata1 = 'testfile1w',
        filedata2 = 'testfile2w',
        filedata3 = 'testfile3w';

    beforeEach(function() {
        createFilesDir();
        fileid1 = createFile(filedata1);
        fileid2 = createFile(filedata2, instance.FLAG_NEW);
        fileid3 = createFile(filedata3, instance.FLAG_UPDATED);
    });


    describe('#write()', function() {
        it('should write string data to non-existing file and mark file as new', function(done) {
            var filedata = 'testfile0w';
            var fileid = instance._getFileid(filedata);
            var filepath = instance._getFilepath(fileid);

            assert.strictEqual(fs.existsSync(filepath), false);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);

            instance.write(filedata, function() {
                assert.strictEqual(fs.existsSync(filepath), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath + instance.FLAG_NEW, 'utf8')), filedata);
                done();
            });
        });

        it('should write string data to existing file and mark file as updated', function(done) {
            var filepath = instance._getFilepath(fileid1);

            assert.strictEqual(fs.existsSync(filepath), true);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);

            instance.write(filedata1, function() {
                assert.strictEqual(fs.existsSync(filepath), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath + instance.FLAG_UPDATED, 'utf8')), filedata1);
                done();
            });
        });

        it('should write string data to existing file with new flag and mark file as updated', function(done) {
            var filepath = instance._getFilepath(fileid2);

            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);

            instance.write(filedata2, function() {
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath + instance.FLAG_UPDATED, 'utf8')), filedata2);
                done();
            });
        });

        it('should return fileinfo object with file, path, isNew, isUpdated, rawPath fields', function(done) {
            var filepath = instance._getFilepath(fileid3);

            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);

            instance.write(filedata2, function(success, err, fileinfo) {
                assert.strictEqual(success, true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), true);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath + instance.FLAG_UPDATED, 'utf8')), filedata3);
                assert.notStrictEqual(fileinfo.file, undefined);
                assert.notStrictEqual(fileinfo.path, undefined);
                assert.notStrictEqual(fileinfo.isNew, undefined);
                assert.notStrictEqual(fileinfo.isUpdated, undefined);
                assert.notStrictEqual(fileinfo.rawPath, undefined);
                done();
            });
        });
    });

    describe('#write() - markAsChanged', function() {
        it('should write string data to non-existing file and not mark file as new if markAsChanged = false', function(done) {
            var filedata = 'testfile0w';
            var fileid = instance._getFileid(filedata);
            var filepath = instance._getFilepath(fileid);

            assert.strictEqual(fs.existsSync(filepath), false);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);

            instance.write(filedata, function() {
                assert.strictEqual(fs.existsSync(filepath), true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath, 'utf8')), filedata);
                done();
            }, false);
        });

        it('should write string data to existing file and not mark file as updated if markAsChanged = false', function(done) {
            var filepath = instance._getFilepath(fileid1);

            assert.strictEqual(fs.existsSync(filepath), true);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);

            instance.write(filedata1, function() {
                assert.strictEqual(fs.existsSync(filepath), true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath, 'utf8')), filedata1);
                done();
            }, false);
        });

        it('should write string data to existing file with new flag and not mark file as updated if markAsChanged = false', function(done) {
            var filepath = instance._getFilepath(fileid2);

            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);

            instance.write(filedata2, function() {
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);
                assert.strictEqual(JSON.parse(fs.readFileSync(filepath + instance.FLAG_NEW, 'utf8')), filedata2);
                done();
            }, false);
        });
    });


    afterEach(function() {
        removeFilesDir();
    });

});
