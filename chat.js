(function() {
  var Chat;

  Chat = RTChat.createClass({
    displayName: "Buddy",
    getInitialState: function() {
      return {
        messages: []
      };
    },
    connectionsToPeerIds: function(connections) {
      var _this = this;
      return _.map(connections, function(connection) {
        return connection.peer;
      });
    },
    getlistConnections: function() {
      var peer;
      var _this = this;
      var webrtcconfig = {
        who: "x",
        host: "harshavardhana.net",
        port: "8000",
        path: "/qed",
        debug: 2
      };

      peer = new Peer(who, webrtcconfig});
      this.connections = [];

      peer.on("error", function(error) {
        return alert(error.type);
      });
      return peer.on("open", function(peerId) {
        var connection;
        if (who === "x") {
          peer.on("connection", function(connection) {
            var peerIds;
            _this.connections.push(connection);
            _this.listenForMessage(connection);
            peerIds = _this.connectionsToPeerIds(_this.connections);
            return connection.on("open", function() {
              var connectionsWithoutNewConnection, peerIdsWithoutNewConnection;
              connectionsWithoutNewConnection = _.filter(_this.connections,
                                                         function(c) {
                                                           return c.peer !== connection.peer;
                                                         });
              peerIdsWithoutNewConnection = _this.connectionsToPeerIds(connectionsWithoutNewConnection);
              if (peerIdsWithoutNewConnection.length) {
                return connection.send({
                  type: "newConnection",
                  peerIds: peerIdsWithoutNewConnection
                });
              }
            });
          });
        }
        if (who !== "x") {
          connection = peer.connect("x");
          connection.on("error", function(error) {
            return alert(error);
          });
          connection.on("open", function() {
            _this.connections.push(connection);
            _this.listenForMessage(connection);
            return connection.on("data", function(data) {
              var peerIds;
              if (data.type === "newConnection") {
                peerIds = data.peerIds;
                return _.forEach(peerIds, function(peerId) {
                  connection = peer.connect(peerId);
                  return (function(connection) {
                    connection.on("error", function(error) {
                      return alert(error.type);
                    });
                    return connection.on("open", function() {
                      _this.connections.push(connection);
                      return _this.listenForMessage(connection);
                    });
                  })(connection);
                });
              }
            });
          });
          return peer.on("connection", function(connection) {
            return connection.on("open", function() {
              _this.connections.push(connection);
              return _this.listenForMessage(connection);
            });
          });
        }
      });
    }
  });
}).call(this);