describe('filedb', function() {

    var fileid1,
        filename1 = 'testfile1u';

    beforeEach(function() {
        createFilesDir();
        fileid1 = createFile(filename1, instance.FLAG_NEW);
    });


    describe('#unlink()', function() {
        it('should return false, error when there is no file', function(done) {
            instance.unlink('nofile', function(success, err) {
                assert.strictEqual(success, false);
                assert.strictEqual(err instanceof Error, true);
                done();
            });
        });

        it('should remove file and return true, null when file exisits', function(done) {
            var filepath = instance._getFilepath(fileid1);
            assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), true);

            instance.unlink(fileid1, function(success, err) {
                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(fs.existsSync(filepath), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_NEW), false);
                assert.strictEqual(fs.existsSync(filepath + instance.FLAG_UPDATED), false);
                done();
            });
        });
    });


    afterEach(function() {
        removeFilesDir();
    });

});
