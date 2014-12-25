describe('filedb', function() {

    var fileid1;

    before(function() {
        createFilesDir();
    });


    describe('all', function() {
        it('write - should write to a file', function(done) {
            instance.write('all1', function(success, err, fileinfo) {
                fileid1 = fileinfo.file;

                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.notEqual(fileinfo.file.length, 0);
                done();
            });
        });

        it('read - should read content of previously created file', function(done) {
            instance.read(fileid1, function(err, data) {
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(data, 'all1');
                done();
            });
        });
    });


    after(function() {
        removeFilesDir();
        removeFilesDir(path2);
    });

});
