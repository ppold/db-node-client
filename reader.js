var fs = require('fs');
var tambo = require('./client.js');

var config = {
  host: "161.132.6.59",
  port: 6666,
  dbname: "./"
}


fs.readdir('./', function(err, files) {
  if (!err) {

    files.forEach(function(file) {
      fs.readFile(file, function(err, data) {

        if (!err) {
          tambo.connect(config, function(api) {
            api.create(file, data, function(err, data) {
              console.log(data);
            });
          });
        };
        
      });
    });

  }


});