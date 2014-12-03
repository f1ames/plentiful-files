describe('filedb', function() {

    var fileid1, fileid2, fileid3, fileid4, fileid5, fileid6;

    before(function() {
        createFilesDir();
        fileid1 = createFile('testfile1l');
        fileid2 = createFile('testfile2l');
        fileid3 = createFile('testfile3l');
        fileid4 = createFile('testfile4l', instance.FLAG_NEW);
        fileid5 = createFile('testfile5l', instance.FLAG_UPDATED);
        fileid6 = createFile('testfile6l', instance.FLAG_UPDATED);
    });


    describe('#list()', function() {
        it('should list all files', function(done) {
            instance.list(instance.ALL, function(success, err, list) {
                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(list.length, 6);
                done();
            });
        });

        it('should list new files', function(done) {
            instance.list(instance.NEW, function(success, err, list) {
                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(list.length, 1);
                for(var i in list) {
                    assert.strictEqual(list[i].isNew, true);
                    assert.strictEqual(list[i].isUpdated, false);
                }
                done();
            });
        });

        it('should list updated files', function(done) {
            instance.list(instance.UPDATED, function(success, err, list) {
                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(list.length, 2);
                for(var i in list) {
                    assert.strictEqual(list[i].isNew, false);
                    assert.strictEqual(list[i].isUpdated, true);
                }
                done();
            });
        });

        it('should list changed files', function(done) {
            instance.list(instance.CHANGED, function(success, err, list) {
                assert.strictEqual(success, true);
                assert.strictEqual(err instanceof Error, false);
                assert.strictEqual(list.length, 3);
                for(var i in list) {
                    assert.strictEqual((list[i].isNew || list[i].isUpdated), true);
                }
                done();
            });
        });
    });


    after(function() {
        removeFilesDir();
    });

});
