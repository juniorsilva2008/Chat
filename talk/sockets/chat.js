module.exports = function(io) {

	var sockets = io.sockets;

	sockets.on('connection', function (client) {

		console.log('Socket Conetado')

		client.on('send-server', function (msg) {
			
				client.broadcast.emit('new-message', msg);
				client.emit('send-client', msg);

				//console.log('Send-server: ' + msg);

		});


	});
}