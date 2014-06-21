module.exports = function(config){ return new __storage(config); };

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
        var stringified = new $.node.buffer.Buffer(line.trim(), 'base64');
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
        var b64 = new $.node.buffer.Buffer(JSON.stringify({
            k: key,
            v: value,
        }), 'utf-8').toString('base64') + '\n\r';

        $.node.fs.writeFileSync(
            config.path,
            b64,
            {flag: 'a+', encoding: null}
        );
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
