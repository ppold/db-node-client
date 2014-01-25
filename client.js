var net = require('net');

var delimiter = '\r\n';
var create_message = function(action, key, value) {
  // don't add delimiter if value is not specified
  value = value || "";
  if (value) {
    value += delimiter;
  }

  return action + delimiter + key + delimiter + value + delimiter + delimiter + delimiter;
}

var connect = function(config, callback) {
  var client = net.connect({host: config.host, port: config.port}, function() {
  });

  var send_action = function(action, key, value, callback) {
    client.once('data', function(data) {
      callback("error", data.toString());
    });
    client.write(create_message(action, key, value));
  }

  var api = {
    create: function(key, value, callback) {
      send_action("CREATE", key, value, callback);
    },
    read: function(key, callback) {
      send_action("READ", key, null, callback);
    },
    update: function(key, value, callback) {
      send_action("UPDATE", key, value, callback);
    },
    remove: function(key, value, callback) {
      send_action("DELETE", key, null, callback);
    },
    close: function() {
      client.end();
    }
  }

  client.once('data', function(data) {
    send_action('USE', config.dbname, null, function () {
      callback(api);
    });
  });
}

exports.connect = connect;
