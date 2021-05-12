var fs = require('fs');
fs.readdir('.', function(err, files) {
    console.log(files);
});
