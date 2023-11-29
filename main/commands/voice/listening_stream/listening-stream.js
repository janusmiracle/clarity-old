const { EndBehaviorType, VoiceReceiver } = require('@discordjs/voice');
//const { Snowflake } = require('discord.js');
const { opus } = require('prism-media');
const { createWriteStream } = require('fs');
const { pipeline } = require('node:stream');
//import prism from 'prism-media';  

// VoiceReceiver, Snowflake, Object
function createListeningStream(receiver, userId, userMap) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000,
        },
    });

    const oggStream = new opus.OggLogicalBitstream(
        {
            opusHead: new opus.OpusHead({
                channelCount: 2,
                sampleRate: 48000,
            }),
            pageSizeControl: {
                maxPackets: 10,
            },
            crc: true
        }
    );

    const filename = `./recordings/${Date.now()}-${userMap[userId]}.ogg`;

    const out = createWriteStream(filename);

    console.log(`Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`Error recording file ${filename} - ${err.message}`);
        } else {
            console.log(`Recorded ${filename}`);
        }
    });
}

//export default createListeningStream;