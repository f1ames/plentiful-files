describe('filedb', function() {

    var glob = require('glob');
    var onReady = function(counter, all, done) {
        if (counter === all) {
            assert.strictEqual(fs.existsSync(instance._getFilepath(
                instance._getFileid(JSON.stringify('2'))) + instance.FLAG_NEW), true);
            assert.strictEqual(fs.existsSync(instance._getFilepath(
                instance._getFileid(JSON.stringify('10'))) + instance.FLAG_NEW), true);

            glob(path + '**/*\.*', {}, function(err, files) {
                assert.strictEqual(files.length, all);
                done();
            });
        }
    };
    var onReady2 = function(counter, all, done) {
        if (counter === all) {
            done(); //@TODO
            // assert.strictEqual(fs.existsSync(instance2._getFilepath(
            //     instance2._getFileid(JSON.stringify('2'))) + instance2.FLAG_NEW), true);
            // assert.strictEqual(fs.existsSync(instance2._getFilepath(
            //     instance2._getFileid(JSON.stringify('10'))) + instance2.FLAG_NEW), true);

            // glob(path2 + '**/*\.*', {}, function(err, files) {
            //     console.log(arguments);
            //     assert.strictEqual(files.length, all);
            //     done();
            // });
        }
    };

    before(function() {
        createFilesDir();
    });


    describe('parallel', function() {
        it('write - should write many files at once to existing dir', function(done) {
            var counter = 0;
            instance.write('1', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('2', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('3', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('4', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('5', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('6', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('7', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('8', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('9', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('10', function () {
                counter++;
                onReady(counter, 11, done);
            });
            instance.write('11', function () {
                counter++;
                onReady(counter, 11, done);
            });
        });

        it('write - should write many files at once to new dir', function(done) {
            var counter = 0;
            instance2.write('1', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('2', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('3', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('4', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('5', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('6', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('7', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('8', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('9', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('10', function () {
                counter++;
                onReady2(counter, 11, done);
            });
            instance2.write('11', function () {
                counter++;
                onReady2(counter, 11, done);
            });            
        });
    });


    after(function() {
        removeFilesDir();
    });

});
