registerPlugin({
    name: 'Watch2Gether Link Generator',
    version: '1.1.0',
    backends: ['ts3'],
    description: 'This script will automatically generate w2g links when entering the keyword in TeamSpeak chat',
    author: 'Can Kocyigit <cank3698@googlemail.com>, Datus <noemail4u>',
    requiredModules: ['http'],
    vars: [
    {
        name: 'default_yt_link',
        title: 'Default Youtube link to generate the room',
        type: 'string',
        placeholder: 'https://www.youtube.com/watch?v=tpiyEe_CqB4'
    },
    {
        name: 'command_trigger',
        title: 'command to trigger with',
        type: 'string',
        placeholder: 'w2g'
    },
    {
        name: 'w2g_color',
        title: 'The backgroundcolor of the generated Watch2Gether site',
        type: 'string',
        placeholder: '#00ff00'
    },
    {
        name: 'w2g_opacity',
        title: 'The background opacity of the generated Watch2Gether site',
        type: 'string',
        placeholder: '50'
    },
    {
        name: 'w2g_api_endpoint',
        title: 'Watch2Gethers API Endpoint-URL',
        type: 'string',
        placeholder: 'https://w2g.tv/rooms/create.json'
    },
    {
        name: 'w2g_api_key',
        title: "Watch2Gether API Key If you don’t have a Watch2Gether account yet, sign up here first: https://w2g.tv/auth/sign_up \
        The required API key can be generated in you account settings. \
        Login to your account > “Edit Profile” on the right > At the bottom “New” to generate a new key",
        type: 'string'
    }
    ]
}, (_, config, meta) => {
const engine = require('engine');
const event = require('event');
const http = require('http');
const backend = require('backend');
const store = require('store');

var videoUrl = "";

event.on('load', () => {
    const command = require('command');

    if (!command) {
        return;
    }

    engine.log("Registering command: " + config.command_trigger);
    command.createCommand(config.command_trigger)
    .addArgument(command.createArgument('string').setName('videoUrl'))
    .help('Create Watch2Gether lobby')
    .manual('Create a Watch2Gether lobby and set the initial video (optional)')
    .exec((client, args, reply, ev) => {
        var videoUrl = args.videoUrl;

        if (videoUrl == '') {
            videoUrl = config.default_yt_link;
        }

        createRoom(videoUrl, reply);
    });
});

function sendMsg(msg, to_client, mode)
{
    switch(Number(mode)) {
        case 1:
            backend.getClientByID(to_client).chat(msg);
            //engine.log(backend.getClientByID(to_client).getChannels()[0])
            //backend.getClientByID(to_client).getChannels()[0].chat(msg);
            break;
        case 2:
            backend.getCurrentChannel().chat(msg);
            break;
        case 3:
            backend.chat(msg);
            break;
    }
}

function createRoom(yturl, reply)
{
    var sendData = JSON.stringify({'w2g_api_key':config.w2g_api_key,'share':yturl,'bg_color':config.w2g_color,'bg_opacity':config.w2g_opacity});

    http.simpleRequest({
        'method': 'POST',
        'url': config.w2g_api_endpoint,
        'timeout': 2000,
        'body': sendData,
        'headers': {
            'Content-Type': 'application/json',
            'Content-Length': sendData.length
        }
        },
        function (error, response) {
            if (error) {
                engine.log("Error: " + error);
                return;
            }
            if (response.statusCode != 200) {
                engine.log("HTTP Error: " + response.status);
                return;
        }
        var res;
        try {
            res = JSON.parse(response.data.toString());
        } catch (err) {
            engine.log(err.message);
        }
        if (res === undefined) {
            engine.log("Invalid JSON.");
            return "Invalid JSON.";
        }
        reply(makeUrl(res.streamkey));
    });
}

function makeUrl(streamkey) {
    return "https://w2g.tv/rooms/" + streamkey;
}
})
