module.exports = function(io) {

	var crypto = require('crypto')
		, md5 = crypto.createHash('md5')
		, sockets = io.sockets;


	sockets.on('connection', function (client) {

		//conecta o usuário
		var session = client.handshake.session;
		var user = session.login;

		//client.set('email', user.email);

		console.log('Socket Conetado')

		client.on('send-server', function (msg) {
			client.broadcast.emit('new-message', session);
			client.emit('send-client', session);
			//console.log('Send-server: ' + msg);
		});


		var onlines = sockets;
		var totalOnline = findTotalClientsOnline();

		client.emit('notify-online', totalOnline);
		client.broadcast.emit('notify-online', totalOnline);


	});


	function findTotalClientsOnline() {
		var res = 0;
		    for (var id in sockets.sockets) {
		    	res++;
			}
		return res;
	}

/*	function findClientsSocketByRoomId(roomId) {
	var res = []
	, room = io.sockets.adapter.rooms[roomId];
	if (room) {
	    for (var id in room) {
	    res.push(io.sockets.adapter.nsp.connected[id]);
	    }
	}
	return res;
	}*/


}

