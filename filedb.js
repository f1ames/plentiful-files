(function(namespace) {
    'use strict';

    var fs = require('fs');
    var glob = require('glob');
    var path = require('path');
    var mkpath = require('mkpath');
    var md5 = require('MD5');
    var errors =  {
        'nofile': 'The file does not exists',
        'emptyfileid': 'Empty file id'
    };


    var PlentifulFiles = function(config) {
        this.prefix = config.prefix || 'PF';
        this.dir = path.normalize(config.dir + '/' || './');
        this.markCreate = config.markCreate === undefined ? true : config.markCreate;
        this.markUpdate = config.markUpdate === undefined ? true : config.markUpdate;
    };
    PlentifulFiles.prototype = {
        ALL: 0,
        NEW: 1,
        UPDATED: 2,
        CHANGED: 3,
        FLAG_NEW: '.pfnew', //private
        FLAG_UPDATED: '.pfupdated', //private


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

            if(!(data instanceof String)) {
                data = JSON.stringify(data);
            }
            var id = this._getFileid(data);
            markAsChanged = (markAsChanged == false ? false : true);
            this.exists(id, function(exists, err, fileinfo) {
                var flag = this.FLAG_NEW;
                if(exists) {
                    flag = this.FLAG_UPDATED;
                }
                this._write(fileinfo, flag, data, callback, markAsChanged);
            }.bind(this));
        },

        list: function(type) { //should return lazy iterator, nah

        },

        _read: function(id, path, callback, markAsViewed) {
            fs.readFile(path, 'utf8', function(err, data) {
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

        _write: function(fileinfo, flag, data, callback, markAsChanged) {
            mkpath(fileinfo.path, function(err) {
                if(err) {
                    callback(false, err, null);
                }
                else {
                    this._writeFile(fileinfo, flag, data, callback, markAsChanged);
                }
            }.bind(this));
        },

        _writeFile: function(fileinfo, flag, data, callback, markAsChanged) {
            if(flag === this.FLAG_NEW) {
                fs.writeFile(fileinfo.rawPath, data, function(err) {
                    callback(!(err !== null && err !== undefined), err, fileinfo);
                }.bind(this));
            }
            else {

            }
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

        _changeFileStatus: function(id, oldPath, callback, status) {
            var suffix = '';
            switch(status) {
                case this.NEW:
                    suffix = FLAG_NEW;
                    break;
                case this.UPDATED:
                    suffix = FLAG_UPDATED;
                    break;
            };
            fs.rename(oldPath, this._getFilepath(id + suffix), function(err) {
                callback(err);
            });
        },

        _checkCallback: function(callback) {
            if(!(callback instanceof Function)) {
                throw new Error('Callback should be a function');
            }
        }
    };

    module.exports = PlentifulFiles;
})(this);
