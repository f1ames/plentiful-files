(function(namespace) {
    'use strict';

    var fs = require('fs');
    var glob = require('glob');
    var path = require('path');
    var mkpath = require('mkpath');
    var md5 = require('MD5');
    var errors =  {
        'nofile': 'The file does not exists',
        'nocallback': 'Callback should be a function',
        'emptyfileid': 'Empty file id'
    };


    var PlentifulFiles = function(config) {
        this.prefix = config.prefix || 'PF';
        this.dir = path.normalize(config.dir + '/' || './');
        // this.markCreate = config.markCreate === undefined ? true : config.markCreate; //@TODO test
        // this.markUpdate = config.markUpdate === undefined ? true : config.markUpdate; //@TODO test
    };
    PlentifulFiles.prototype = {
        ALL: 0,
        NEW: 1,
        UPDATED: 2,
        CHANGED: 3,
        FLAG_NEW: '.pfnew', //@TODO private
        FLAG_UPDATED: '.pfupdated', //@TODO private


        /**
         * @function exists
         * @param id:String file id returned by save or list
         * @param callback:Function callback with arguments [exists, err, fileinfo]
         */
        exists: function(id, callback) {
            this._checkCallback(callback);
            if((id || '').length === 0) {
                callback(false, null, null);
                return;
            }

            glob(this._getFilepath(id) + '?(' + this.FLAG_NEW + '|' + this.FLAG_UPDATED + ')', function(err, files) {
                var isFile = files && files.length;
                var filename = isFile ? files[0] : null;
                callback(isFile == 0 ? false : true, err, this._createFileInfo(id, filename));
            }.bind(this));
        },

        /**
         * @function read
         * @param id:String file id returned by save or exists
         * @param callback:Function callback with arguments [err, data]
         * @param markAsViewed:boolean if turn off new/updated flag after reading, defaults to true
         */
        read: function(id, callback, markAsViewed) {
            this._checkCallback(callback);
            if((id || '').length === 0) {
                callback(new Error(errors.emptyfileid), null);
                return;
            }

            markAsViewed = (markAsViewed == false ? false : true);
            this.exists(id, function(exists, err, fileinfo) {
                if(err) {
                    callback(err, null);
                }
                else if(!exists) {
                    callback(new Error(errors.nofile), null);
                }
                else {
                    this._read(fileinfo.file, fileinfo.rawPath, callback, markAsViewed);
                }
            }.bind(this));
        },

        /**
         * @function write
         * @param data:Object data to write to the file (String|JSON.stringify(data))
         * @param callback:Function callback with arguments [success, err, fileinfo]
         * @param markAsChanged:boolean if turn on new/updated flag after reading, defaults to true
         */
        write: function(data, callback, markAsChanged) {
            this._checkCallback(callback);

            data = JSON.stringify(data);
            var id = this._getFileid(data);
            
            markAsChanged = (markAsChanged == false ? false : true);
            this.exists(id, function(exists, err, fileinfo) {
                if(exists) {
                    this._writeExistingFile(fileinfo, data, callback, markAsChanged);
                }
                else {
                    this._writeNewFile(id, data, callback, markAsChanged);
                }
            }.bind(this));
        },

        /**
         * @function unlink
         * @param id:String file id returned by save or exists
         * @param callback:Function callback with arguments [success, err]
         */
        unlink: function(id, callback) {
            this._checkCallback(callback);
            if((id || '').length === 0) {
                callback(false, new Error(errors.emptyfileid));
                return;
            }

            this.exists(id, function(exists, err, fileinfo) {
                if(err) {
                    callback(false, err);
                }
                else if(!exists) {
                    callback(false, new Error(errors.nofile));
                }
                else {
                    this._unlink(fileinfo.rawPath, callback);
                }
            }.bind(this));
        },

        /**
         * @function list
         * @param type:integer list by status (ALL, NEW, UPDATED, CHANGED)
         * @param callback:Function callback with arguments [success, err, list]
         */
        list: function(type, callback) {//@TODO list cache
            this._checkCallback(callback);

            var pattern = '*?(' + this.FLAG_NEW + '|' + this.FLAG_UPDATED + ')';
            switch(type) {
                case this.NEW:
                    pattern = '*+(' + this.FLAG_NEW + ')';
                    break
                case this.UPDATED:
                    pattern = '*+(' + this.FLAG_UPDATED + ')';
                    break
                case this.CHANGED:
                    pattern = '*+(' + this.FLAG_NEW + '|' + this.FLAG_UPDATED + ')';
                    break
            }

            glob(this.dir + '**/' + pattern, {nodir: true}, function(err, files) {
                err = err || null;

                var length = files.length;
                var filesinfo = [];
                for(var i = 0; i < length; i++) {
                    var id = files[i].split('/').pop().split('.').shift();
                    filesinfo.push(this._createFileInfo(id, files[i]));
                }

                callback(err === null, err, filesinfo);
            }.bind(this));
        },

        _read: function(id, path, callback, markAsViewed) {
            fs.readFile(path, 'utf8', function(err, data) {
                data = JSON.parse(data);
                if(markAsViewed) {
                    var newCallback = function(newErr) {
                        callback(newErr, data);
                    };
                    this._changeFileStatus(id, path, newCallback);
                }
                else {
                    callback(err, data);
                }
            }.bind(this));
        },

        _writeNewFile: function(fileid, data, callback, markAsChanged) {
            var path = this._getPath(fileid);

            mkpath(path, function(err) {
                if(err) {
                    callback(false, err, null);
                }
                else {
                    this._writeFile(fileid, markAsChanged ? this.FLAG_NEW : '', data, callback);
                }
            }.bind(this));
        },

        _writeExistingFile: function(fileinfo, data, callback, markAsChanged) {
            var flag = '';
            if(markAsChanged) {
                flag = this.FLAG_UPDATED;
            }
            else if(fileinfo.isNew) {
                flag  = this.FLAG_NEW;
            }
            else if(fileinfo.isUpdated) {
                flag = this.FLAG_UPDATED;
            }

            var newCallback = function(err) {
                if(err) {
                    callback(false, err, null);
                }
                else {
                    this._writeFile(fileinfo.file, flag, data, callback);
                }
            }.bind(this);

            this._changeFileStatus(fileinfo.file, fileinfo.rawPath, newCallback, flag);
        },

        _writeFile: function(fileid, flag, data, callback) {
            var filepath = this._getFilepath(fileid, flag);
            fs.writeFile(this._getFilepath(fileid, flag), data, function(err) {
                callback(!(err !== null && err !== undefined), err, this._createFileInfo(fileid, filepath));
            }.bind(this));
        },

        _unlink: function(path, callback) {
            fs.unlink(path, function(err) {
                if(err) {
                    callback(false, err);
                }
                else {
                    callback(true, null);
                }
            });
        },

        _getFileid: function(data) {
            return md5(this.dir + this.prefix + data.length + data.substr(0, 10));
        },

        _getPath: function(id) {
            return path.normalize(this.dir + id.substr(0, 3) + '/');
        },

        _getFilepath: function(id, flag) {
            flag = flag || '';
            return this._getPath(id) + id + flag;
        },

        _createFileInfo: function(id, filename) {
            if(filename) {
                var flag = '.' + filename.split('.').pop();
                return {
                    file: id,
                    path: this._getPath(id),
                    isNew: flag === this.FLAG_NEW,
                    isUpdated: flag === this.FLAG_UPDATED,
                    rawPath: this._getFilepath(id, (flag === this.FLAG_NEW || flag === this.FLAG_UPDATED ? flag : null))
                }
            }
            return null;
        },

        _changeFileStatus: function(id, oldPath, callback, flag) {
            var suffix = '';
            switch(flag) {
                case this.FLAG_NEW:
                    suffix = this.FLAG_NEW;
                    break;
                case this.FLAG_UPDATED:
                    suffix = this.FLAG_UPDATED;
                    break;
            };
            fs.rename(oldPath, this._getFilepath(id + suffix), function(err) {
                callback(err);
            });
        },

        _checkCallback: function(callback) {
            if(!(callback instanceof Function)) {
                throw new Error(errors.nocallback);
            }
        }
    };

    module.exports = PlentifulFiles;
})(this);
