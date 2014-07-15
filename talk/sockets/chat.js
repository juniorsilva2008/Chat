module.exports = function(io) {

	var crypto = require('crypto')
		, md5 = crypto.createHash('md5')
		, sockets = io.sockets;


	sockets.on('connection', function (client) {

		//conecta o usuário
		var session = client.handshake.session;
		console.log('Socket Conetado')
		var qtdOnline=0;


		//Lista os clientes conectados e manda para o navegador
		findClientsOnLine().forEach(function(user){
			if(user.login){
				//Se não for eu mesmo
				if(user.login.email != session.login.email)
					qtdOnline++;

				client.emit('notify-online',  {email: user.login.email, qtdOnline: qtdOnline} );
				client.broadcast.emit('notify-online', {email: user.login.email, qtdOnline: qtdOnline} );
			};
		});


		client.on('send-server', function (msg) {

			//client.broadcast.emit('new-message', msg);
			client.emit('send-client', {user: session.login, msg: msg});
			client.broadcast.emit('send-client', {user: session.login, msg: msg});
			//client.broadcast.emit('new-message', msg);
			console.log('Send-server: ' + session.login.name);
		});


		client.on('disconnect', function(){
			client.emit('notify-offline', {email: session.login.email, qtdOnline: qtdOnline} );
			client.broadcast.emit('notify-offline', {email: session.login.email, qtdOnline: qtdOnline} );
			console.log('Socket Desconetado')
			//client.leave();
		});



	});


	function findTotalClientsOnline() {
		var res = 0;
		    for (var id in sockets.sockets) {
		    	res++;
			}
		return res;
	}

//Clientes online
	function findClientsOnLine() {
	var res = []
	, sids = io.sockets.adapter.sids;
	if (sids) {
	    for (var id in sids) {
	    res.push(io.sockets.adapter.nsp.connected[id].handshake.session);
	    }
	}
	return res;
	}


//Localiza online por sala
	/*function findClientsSocketByRoomIds(roomId) {
	var res = []
	, room = io.sockets.adapter.rooms;
	if (room) {
	    for (var id in room) {
	    res.push(io.sockets.adapter.nsp.connected[id]);
	    }
	}
	return res;
	}*/


}

