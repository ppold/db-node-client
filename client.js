var delimiter = '\n';
var net = require('net');

var create_message = function(action, key, value) {
  // don't add delimiter if value is not specified
  value = value || "";
  if (value) {
    value += delimiter;
  }

  return action + delimiter + key + delimiter + value + delimiter + delimiter;
}

var tambo = {
  connect: function(host, port, callback) {
    var client = net.connect({host: host, port: port},
        function() { //'connect' listener
      console.log('client connected');
    });
    client.once('data', function(data) {
        //console.log(data.toString());
        //client.end();
        //
        console.log("bienvenido", data.toString());
        callback();
    });
    client.on('end', function() {
      console.log('client disconnected');
    });

    var send_action = function(action, key, value, callback) {
      console.log("mandando mensaje");
      client.once('data', function(data) {
        //console.log(data.toString());
        //client.end();
        //
        callback(data.toString());
      });
      var messageToBeSent = create_message(action, key, value);
      console.log("el mensaje que se enviará es:\n" + messageToBeSent);
      client.write(messageToBeSent);
    }

    return {
      create: function(key, value, callback) {
        send_action("CREATE", key, value, callback);
      },
      read: function () {
        send_action("READ", key, callback);
      },
      update: function() {
        send_action("UPDATE", key, value, callback);
      },
      remove: function () {
        send_action("DELETE", key, callback);
      }
    };
  }
}

var api = tambo.connect("161.132.6.59", 6666, function() {
  api.create("2nuestra-llave", "nuestro-valor", function(response) {
    console.log("nuestra respuesta es:" + response);
  });
});

//api.read(key, function(response) {

//});
//api.update(key, value, function(response) {

//});
//api.remove(key, function(response) {

//});
