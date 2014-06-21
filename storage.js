module.exports = function(config){ return new __storage(config); };

var _fs = require('fs'), _buffer = require('buffer');
function __storage(config){
    var self = this;

    if(!config.path)
        throw new Error('Storage file path[config.path] not configured.');
    
    var tree = {};

    // TODO read in file and initialize tree.
    // TODO if too much records are old, optimize the file before any
    //      actions

    function _read(line){
        // returns true, when a fresh item is registered.
        // returns false, when an item is errorous, or when old items under
        //                the same key exists.
        var stringified = _buffer.Buffer(line.trim(), 'base64');
        stringified = stringified.toString('utf-8');
        try{
            var json = JSON.parse(stringified), ret=true;
            if(tree[json.k]) ret = false;
            tree[json.k] = json.v;
        } catch(e){
            return false;
        };
        return ret;
    };

    function _save(key, value){
        var b64 = new _buffer.Buffer(JSON.stringify({
            k: key,
            v: value,
        }), 'utf-8').toString('base64') + '\n\r';

        _fs.writeFileSync(
            config.path,
            b64,
            {flag: 'a+', encoding: null}
        );
    };

    /* read the file for initializing */
    var filedataBuf = _buffer.Buffer(0);
    try{
        filedataBuf = _fs.readFileSync(
            config.path, 
            {
                encoding: null,
                flag: 'r+',
            }
        );
    } catch(e){
    };

    var count = 0, ineffective = 0;
    var parseBuf = '', lastBreak = 0, readResult = false;
    for(var i=0; i<filedataBuf.length; i++){
        if(filedataBuf[i] != 0x0a) continue; // \n
        count += 1;
        parseBuf = filedataBuf.slice(lastBreak, i);
        lastBreak = i + 1;
        readResult = _read(parseBuf.toString());
        if(!readResult) ineffective += 1;
    };


    //////////////////////////////////////////////////////////////////////
    
    this.key = function(key){
        if('string' !== typeof key)
            throw new Error('Invalid key for accessing data.');

        return function(v){
            if(undefined === v) return tree[key] || null; // get value
            // set value
            tree[key] = v;
            _save(key, v);
            return self;
        };
    };

    this.all = function(){
    };

    return self;
};
