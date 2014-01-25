var fs = require('fs');
var tambo = require('./tambo.js');

var config = {
  host: "161.132.6.59",
  port: 6666,
  dbname: "images"
}

tambo.connect(config, function(api) {
  fs.readdir('./', function(err, files) {
    if (!err) {
      files.forEach(function(file) {
        fs.readFile(file, function(err, data) {
          if (!err) {
            api.create(file, data, function(err, data) {
              console.log(data);
            });
          };
        });
      });
    }
  });
});
