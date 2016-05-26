'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        // prompt: (bot) => bot.say('Bbye. Thanks for taking time to talk to me today...'),
        receive: () => 'processing'
    },

    start: {
        prompt: (bot) => bot.say('I am getting smarter day be day. Please check back with me again.'),
        receive: (bot) => {
            return bot.say('Hi! I\'m  Botu')
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say('What\'s your name?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                 .then(() => bot.say(`Great! Good to know you ${name}`))
                .then(() => 'speak');  
        }
    },
    
    talkRandom: {
        prompt: (bot) => bot.say("I normally don't let go anyone untill they say 'bye'.\n For more info you can contact Awdesh at 'awdesh@outlook.com' or 3153829915"),
        receive: (bot, message) => {
                let upperText = message.text.trim().toUpperCase();
                if(upperText === "BYE"){
                    return bot.say("Great chatting with you. Have a good day ahead. Bye.");
                }
            }
    },

    tellHackathon: {
        prompt: (bot) => bot.say("Want to learn more about Awdesh-: %[Yes](postback:yes)"),
        receive: (bot, message) => {
                let upperText = message.text.trim().toUpperCase();
                if(upperText === 'YES'){
                    return bot.say('Awdesh recently participated in AngelHack Hackathon. Successfully developed a smart ToDo App on Alexa and pitched the idea to investors\n. Amazon recognized the effort and rewarded each team member with Fire-TV. Hurray!!!!. You can see source code of it at => https://github.com/Awdesh/AutoAlexa.git').then(() => 'tellCurrent'); 
                }
            }
    },

    tellCurrent: {
        prompt: (bot) => bot.say("Want to learn more about Awdesh-: %[Yes](postback:yes)"),
        receive: (bot, message) => {
                let upperText = message.text.trim().toUpperCase();
                if(upperText === 'YES'){
                    return bot.say('In his current position Awdesh is contributing in Python powered code base,\n where He is working majorly on imporving backend performance by refactoring search, device activate calls and batch updating activity.\n Using PyMongo and mongoEngine as an ORM for mongoDB database.').then(() => 'tellCurrentSkill'); 
                }
            }
    },

    tellCurrentSkill: {
        prompt: (bot) => bot.say("Want to learn more about Awdesh-: %[Yes](postback:yes)"),
        receive: (bot, message) => {
                let upperText = message.text.trim().toUpperCase();
                if(upperText === 'YES'){
                    return bot.say('Awdesh recently participated in AngelHack Hackathon. Successfully developed a smart ToDo App on Alexa and pitched the idea to investors.\n Amazon recognized the effort and rewarded each team member with Fire-TV. Hurray!!!!. You can see source code of it at => https://github.com/Awdesh/AutoAlexa.git').then(() => 'talkRandom'); 
                }
            }
    },

    speak: {
        prompt: (bot) => bot.say("Anytime you can type Education, Blog, Career, Skill, Contact in order to learn about Awdesh"),
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {  
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say('I prefer to stay quite if I don\'t understand anything..').then(() => 'tellHackathon');
                }

                var response = scriptRules[upperText];
                var lines = response.split(/(<img src=\'[^>]*\'\/>)/);

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    if (!line.startsWith("<")) {
                        p = p.then(function() {
                            return bot.say(line);
                        });
                    } else {
                        // p = p.then(function() {
                        //     var start = line.indexOf("'") + 1;
                        //     var end = line.lastIndexOf("'");
                        //     var imageFile = line.substring(start, end);
                        //     return bot.sendImage(imageFile);
                        // });
                    }
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
