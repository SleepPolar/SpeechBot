const tmi = require('tmi.js');
const fs = require('fs');
const { AudioContext } = require('node-web-audio-api');
const say = require('say');
const loudness = require('loudness');

loudness.setVolume(0.1);

const audioContext = new AudioContext()
const mutedUsernames = new Set(["godzrgg", "nightbot"])
const mutedMessages = new Set(["!elo", "!opgg", "!clip"])

const audioFile = fs.readFileSync('C:/Users/FerDe/OneDrive/Documentos/Twitch/sms.mp3')
const arrayBuffer = Uint8Array.from(audioFile).buffer

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [ 'godzrgg' ]
});

client.connect();

client.on('message', (_, {username}, message) => {
    if (mutedUsernames.has(username) || mutedMessages.has(message)) return
    
    audioContext.decodeAudioData(arrayBuffer, buffer => {
        const source = audioContext.createBufferSource()
        source.buffer = buffer

        const gainNode = audioContext.createGain()
        source.connect(gainNode)

        gainNode.connect(audioContext.destination)
        source.start(0);

        say.speak(message, null, 1)
    }, error => {
        console.error('Error al decodificar el audio:', error)
    });
})