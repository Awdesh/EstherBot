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
        prompt: (bot) => bot.say('Though I can tell you a joke, interested?')
        receive: (bot, message) => {
            const interested = message.text;
            if(${interested} === "yes")
                return bot.say("Joke...");
            else
                return bot.say("No Joke...")
                // if(${interested} === "yes"){
                //     .then(() => bot.say("Joke..."));
                // }
                // else{
                //     .then(() => bot.say("I know I disappointed you. Please talk with me back again, I'll be smarter.. Promise"));
                // }
        }
    },

    speak: {
        prompt: (bot) => bot.say('Anytime you can type Education, Blog, Career, Skill in order to learn about Awdesh'),
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
                    return bot.say("Sorry Awdesh didn't teach me that, but one day...").then(() => 'talkRandom');
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
