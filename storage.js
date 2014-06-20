module.exports = function(config){ return new __storage(config); };

function __storage(config){
    var self = this;

    if(!config.path)
        throw new Error('Storage file path[config.path] not configured.');
    
    var tree = {};

    function _save(key, value){
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