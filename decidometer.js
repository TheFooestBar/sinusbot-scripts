registerPlugin({
    name: 'Decidometer',
    version: '1.0.0',
    backends: ['ts3'],
    description: 'Decidometer helps you when you cant decide yourself',
    author: 'Can Kocyigit <cank3698@googlemail.com>',
    requiredModules: [],
    vars: [
    {
        name: 'command_trigger',
        title: 'command to trigger with',
        type: 'string',
        placeholder: '!decide'
    }
    ] 
}, (_, config, meta) => {

    const engine = require('engine');
    const event = require('event');
    const backend = require('backend');
	const store = require('store');
	
	var worter = ["obviously", "logischerweise", "of course:", "this is the plan:", "Raymond Reddington would take:", "natürlichhhhhhh", "get to the chopper", "Konfuzius sagt"]
	

    event.on('chat',  function(ev) {
		var messages = ev.text.split(" ");

		if(messages[0] == config.command_trigger && messages[1] === undefined)
		{	
			sendMsg("This command needs atleast 2 arguments", ev.client.id(), ev.mode)
		}
		if(messages[0] == config.command_trigger && messages[1] !== undefined && messages[2] !== undefined)
		{
			choose(messages, ev);
		}
		if(messages[0] == "!question" && messages[1] !== undefined)
		{	
			decide(ev);			
		}
		
   });
	
	function sendMsg(msg, to_client, mode)
	{
		switch(Number(mode)) {
			case 1:
				backend.getClientByID(to_client).chat(msg);
				break;
			case 2:
				backend.getCurrentChannel().chat(msg);
				break;
			case 3:
				backend.chat(msg);
				break;
		}
	
	}
	
    function choose(strings, ev)
    {	
		var randomNumber = Math.floor(Math.random() * (strings.length - 1)) + 1; 
		var randomNumber1 = Math.floor(Math.random() * worter.length); 
        sendMsg(worter[randomNumber1] + " " + strings[randomNumber], ev.client.id(), ev.mode)
    }
	
	function decide(ev)
	{
			var randomNumber = Math.floor(Math.random() * 2);
			var randomNumber1 = Math.floor(Math.random() * worter.length); 
			if(randomNumber == 0)
			{
				sendMsg(worter[randomNumber1] + " Ja", ev.client.id(), ev.mode)
			}
			if(randomNumber == 1)
			{
				sendMsg(worter[randomNumber1] + " Nein", ev.client.id(), ev.mode)
			}
	}


})
