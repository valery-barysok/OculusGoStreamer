
var player;

var audiosocket = null;
function initAudio() {
	$(".menu-audio").click(function() {
		if (audiosocket) {
			audiosocket.close();
			audiosocket = null;
		} else {
			connectAudioSocket();
		}
	});
}

function connectAudioSocket() {
	if (audiosocket && audiosocket.readyState !== audiosocket.CLOSED) return;

	if (player) player.destroy();
	player = new PCMPlayer({
	    encoding: '8bitInt',
	    channels: 1,
	    sampleRate: 8000,
	    flushingTime: 100
	});

	var source = "ws://" + window.location.host + "/audiosocket?t=" + new Date().getTime();
	audiosocket = new WebSocket(source);
	audiosocket.binaryType = 'arraybuffer';
	audiosocket.onopen = function () {
		console.log("connected audio");
	};
	audiosocket.onclose = function () {
		console.log("disconnected");
		audiosocket = null;
	};
	audiosocket.onmessage = function (msg) {
		var bytes = new Uint8Array(msg.data);
		player.feed(bytes);
		delete bytes;
	};
	audiosocket.onerror = function (msg) {
		console.log('error: ' + msg.data);
		audiosocket.close();
		audiosocket = null;
	};
}
