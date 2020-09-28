registerPlugin({
    name: 'Watch2Gether Connector',
    version: '1.0.0',
    backends: ['ts3'],
    description: 'This script will automatically generate w2g links when entering the keyword in teamspeak chat',
    author: 'Can Kocyigit <cank3698@googlemail.com>',
    vars: []
}, (sinusbot, config) => {
    // import modules
    const engine = require('engine');
    const event = require('event');

    var url = "https://w2g.tv/rooms/create.json";
    var apikey = "g1nvgr95kx5vykyswbdzmqpafsh06ax5ahvyqa9dkgvd2ic4jsn3dxd8ly68z8kl";
    var bg_color = "#00ff00";
    var bg_opacity = "50";



    function createRoom() 
    {
        var settings = {
            "url": url,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json",
              "Cookie": "w2glang=en"
            },
            "data": JSON.stringify({"w2g_api_key":apikey,"share":"https://www.youtube.com/watch?v=tpiyEe_CqB4","bg_color":"#00ff00","bg_opacity":"50"}),
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            return response;
          });
    }

    // listen for chat event
    event.on('chat', ({ client, text }) => {
        engine.log(`${client.name()} wrote ${text}`);
        client.chat(`Hi ${client.name()}, you just wrote: ${text}`);

        if(text.includes("!w2g"))
        {
            client.chat("Created Room " + createRoom + " for you!");
        }
    });
});