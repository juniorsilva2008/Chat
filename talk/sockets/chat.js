module.exports = function(io) {

	var crypto = require('crypto')
		, md5 = crypto.createHash('md5')
		, sockets = io.sockets;


	sockets.on('connection', function (client) {

		//conecta o usuário
		var session = client.handshake.session;
		console.log('Socket Conetado')
		var qtdOnline=0;

		//Emite um ready para infomar a nova conexão
		client.emit('ready')


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


		client.on('send-server', function (data) {
			var myRoomOpened = io.sockets.adapter.nsp.connected[client.id].rooms[1];
			var data_send = {user: session.login, msg: data.msg, room: myRoomOpened, date: getCurrentTime()};
			
			client.to(myRoomOpened).emit('send-client', data_send);
			client.emit('send-client', data_send);

			//Envia mensagem de alerta na agenda do contato
			var chatto = findSocketByEmail(data.chatto);
			client.broadcast.to(chatto).emit('new-message', data_send);
			//console.log('Meu oi = ' + myRoomOpened)
		});


		client.on('join', function(data){
			var room = data.room;
			if(room != 'null')
				room = room.replace('?', '');
			else{
				var timestamp = new Date().toString();
				var md5 = crypto.createHash('md5');
				room = md5.update(timestamp).digest('hex');
			}

			client.join(room);	
			var data_send = {user: session.login, msg: 'Is chatting now!', room: room, date: getCurrentTime()};
			client.to(room).emit('send-client', data_send);

		});

		client.on('disconnect', function(){
			client.emit('notify-offline', {email: session.login.email, qtdOnline: qtdOnline} );
			client.broadcast.emit('notify-offline', {email: session.login.email, qtdOnline: qtdOnline} );
			console.log('Socket Desconetado')

		    var rooms = io.sockets.adapter.rooms;
			if (rooms) {
			    for (var room in rooms) {
			    client.leave(room);
			    }
			}


		});



	});


	//Pega o hora atual
	var getCurrentTime = function() {
		var x = new Date();
		return x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds();
	}

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
		    	//Se tiver client.leave no disconnect, dá pau
		    	if(io.sockets.adapter.nsp.connected[id])
		        	res.push(io.sockets.adapter.nsp.connected[id].handshake.session);

		    }
		}
		return res;
	}


	function findSocketByEmail(email) {
		var sids = io.sockets.adapter.sids;
		if (sids) {
		    for (var id in sids) {
		    	if(io.sockets.adapter.nsp.connected[id])
		    		if(io.sockets.adapter.nsp.connected[id].handshake.session.login.email==email)
		    			return id;
		    }
		}

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

