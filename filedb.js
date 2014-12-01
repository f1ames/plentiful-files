//@TODO - make subdirs on svae, read
(function(namespace) {
    'use strict';

    var fs = require('fs');
    var glob = require('glob');
    var path = require('path');
    var errors =  {
        'nofile': 'The file does not exists'
    };


    var Handler = function(config) {
        this.dir = path.normalize(config.dir + '/' || '.');
        this.markCreate = config.markCreate === undefined ? true : config.markCreate;
        this.markUpdate = config.markUpdate === undefined ? true : config.markUpdate;
    };
    Handler.prototype = {
        ALL: 0,
        NEW: 1,
        UPDATED: 2,
        FLAG_NEW: '.filedb_new',
        FLAG_UPDATED: '.filedb_updated',


        /**
         * @function exists
         * @param id:String file id returned by save
         * @param callback:Function callback with arguments [exists, err, fileinfo]
         */
        exists: function(id, callback) {
            glob(this._path(id) + '?(' + this.FLAG_NEW + '|' + this.FLAG_UPDATED + ')', function(err, files) {
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

        write: function(data) {
            if(!(data instanceof String)) {
                data = JSON.stringify(data);
            }
            this._save(md5('md5' + data.length + substr(0, 15)), data);
        },
        list: function(type) {

        },
        _read: function(id, path, callback, markAsViewed) {
            fs.readFile(path, 'utf8', function(err, data) {
                callback(err, data);
                if(markAsViewed) {
                    this._changeFileStatus(id, path);
                }
            }.bind(this));
        },
        _init: function() {
        },
        _onExists: function(exists, filename, err, action) {
            switch(action) {
                case 'read':
                    if(exists) {
                        fs.readFile(filename, function(err, data) {
                            if(err) {
                                this.externalEmiter.emit('file', false, null, err);
                            }
                            else {
                                this.externalEmiter.emit('file', true, JSON.parse(data), err);
                            }
                        });
                    }
                    else {
                        this.externalEmiter.emit('file', false, null, err);
                    }
                    break;
            }
        },
        _save: function(id, data) {
            var path = this.dir + '/' + substr(0, 3, id);
            fs.exists(path, function(exists) {
                if(!exists) {
                    fs.mkdir(path, function() {
                        this._saveFile(id, path, data);
                    }.bind(this));
                }
                else {
                    this._saveFile(id, path, data);
                }
            }.bind(this));
        },
        _saveFile: function(id, path, data) {
            path = path + '/' + id;
            fs.exists(path, function(exists) {
                if(!exists && this.markCreate) {
                    path += '.new';
                }
                else if(exists && this.markUpdate) {
                    path += '.updated';
                }

                fs.write(path, data, function(err) {
                    if(err) {
                        throw new Error('Error saving file ' + path);
                    }
                }.bind(this));
            }.bind(this));
        },
        _path: function(id) {//@TODO remove mulitple slashes
            return this.dir + id;
        },
        _createFileInfo: function(id, filename) {
            if(filename) {
                return {
                    file: id,
                    path: this.dir,
                    isNew: filename.indexOf(this.FLAG_NEW) !== -1,
                    isUpdated: filename.indexOf(this.FLAG_UPDATED) !== -1,
                    rawPath: filename
                }
            }
            return null;
        },
        _changeFileStatus: function(id, oldPath, status) {
            var suffix = '';
            switch(status) {
                case this.NEW:
                    suffix = FLAG_NEW;
                    break;
                case this.UPDATED:
                    suffix = FLAG_UPDATED;
                    break;
            };
            fs.rename(oldPath, this._path(id + suffix), function(err) {
                if(err) {
                    throw err;
                }
            });
        }
    };

    module.exports = Handler;
})(this);
