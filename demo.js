var storage = require('./storage.js')({
    path: './demo.file',
});

console.log(storage);

console.log(storage.key('testkey')());

storage.key('testkey')(3);
console.log(storage.key('testkey')());
