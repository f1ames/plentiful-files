describe('filedb', function() {

    var fileid1, fileid2, fileid3,
        filedata1 = 'testfile1w',
        filedata2 = 'testfile2w',
        filedata3 = 'testfile3w';

    beforeEach(function() {
        createFilesDir(); 
        fileid1 = createFile(filedata1);
        fileid2 = createFile(filedata2, instance.FLAG_NEW);
        // fileid3 = createFile(filename3, instance.FLAG_UPDATED);
    });


    describe('#write()', function() {
        it('should write string data to non-existing file and mark file as new', function(done) {
            var filedata = 'testfile0w';
            var fileid = instance._getFileid(filedata);
            var filepath = instance._getFilepath(fileid);

            assert.strictEqual(fs.existsSync(filepath), false);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);

            instance.write(filedata, function() {
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);
                assert.strictEqual(fs.readFileSync(filepath + instance.FLAG_NEW), filedata);
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
                assert.strictEqual(fs.readFileSync(filepath + instance.FLAG_UPDATED), filedata1);
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
                assert.strictEqual(fs.readFileSync(filepath + instance.FLAG_UPDATED), filedata1);
                done();
            });
        });

    });


    // afterEach(function() {
    //     removeFilesDir();
    // });

});
