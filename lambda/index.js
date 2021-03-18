/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const hacks = require("./hacks");
const persistenceAdapter = require("ask-sdk-s3-persistence-adapter");

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        //get SESSION attributes for hackScore and newUser
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        const hackScore = sessionAttributes.hasOwnProperty('hackScore') ? sessionAttributes.hackScore : 0;
        const newUser = sessionAttributes.hasOwnProperty('newUser') ? sessionAttributes.newUser : false;
        
        let speakOutput;
        
        //set speakOutput depending on whether this is a new or returning user 
        if (newUser) {
            speakOutput = '<amazon:emotion name="excited" intensity="medium">Welcome to wired life hacks Manu Bumb.</amazon:emotion> to get todays life hack, say tell me a life hack';  //"Welcome to wired brain life hacks! to get todays life hack, say tell me a life hack";
            sessionAttributes.newUser = false;
        } else {
            speakOutput = '<amazon:emotion name="excited" intensity="medium">Welcome back Manu Bumb!</amazon:emotion> your hack score is ' + hackScore + ".  If you tried a life hack, say add to score.  Or to get a new hack, say tell me a life hack.";
        }
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};

const WiredLifeHacksIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WiredLifeHacksIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = hacks[Math.floor(Math.random() * hacks.length)];
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const IncrementHackScoreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'IncrementHackScoreIntent';
    },
    handle(handlerInput) {
        //get current hackScore from SESSION attributes
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        //Increment score by 1 
        const hackScore = sessionAttributes.hasOwnProperty('hackScore') ? sessionAttributes.hackScore + 1 : 0;
        
        // Set sessionAttributes with new hackScore
        sessionAttributes.hackScore = hackScore;
        attributesManager.setSessionAttributes(sessionAttributes);
        
        console.log("hackScore in IncrementHackScoreIntentHandler is " + hackScore);
        
        const speakOutput = "Your new hack score is " + hackScore + '<audio src="soundbank://soundlibrary/human/amzn_sfx_large_crowd_cheer_03"/>';
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt("What to do next?")
        .getResponse();
    }
};

const PlayPodcastIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayPodcastIntent';
    },
    handle(handlerInput) {
        // issue the audioplayer directive to PLAY, replacing all other streams in the queue
        // Replace the URL parameter with an audio file that meets the criteria covered in the slides
        return handlerInput.responseBuilder
        .addDirective({
            type: 'AudioPlayer.Play',
            playBehavior: 'REPLACE_ALL',
            audioItem: {
                stream: {
                    token: 'FirstPodcast',
//                    url: 's3://489689a9-7e40-4822-900f-2da4e5e20359-us-east-1/Media/Brody.mp4',
                    url: 'https://wiredlifehacks.s3-us-west-2.amazonaws.com/wired-life-podcast.mp4',
                    ottsetInMilliseconds: 0
                }
            }
        })
        .getResponse();
    }
};

const PauseAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent';
    },
    handle(handlerInput) {
        // issue the audioplayer directive to STOP, and use the token and offsetInMilliseconds that was pased in from the request
        // Replace the URL parameter with an audio file that meets the criteria covered in the slides
        return handlerInput.responseBuilder
        .addDirective({
            type: 'AudioPlayer.Stop',
            audioItem: {
                stream: {
                    token: handlerInput.requestEnvelope.context.AudioPlayer.token,
//                    url: 's3://489689a9-7e40-4822-900f-2da4e5e20359-us-east-1/Media/02 - Masturbating [Explicit].mp3',
                    url: 'https://wiredlifehacks.s3-us-west-2.amazonaws.com/wired-life-podcast.mp4',
                    ottsetInMilliseconds: handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds
                }
            }
        })
        .getResponse();
    }
};

const ResumeAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent';
    },
    handle(handlerInput) {
        // issue the audioplayer directive to PLAY, and use the token and offsetInMilliseconds that was pased in from the request
        // Replace the URL parameter with an audio file that meets the criteria covered in the slides
        return handlerInput.responseBuilder
        .addDirective({
            type: 'AudioPlayer.Play',
            playBehavior: 'REPLACE_ALL',
            audioItem: {
                stream: {
                    token: handlerInput.requestEnvelope.context.AudioPlayer.token,
//                    url: 's3://489689a9-7e40-4822-900f-2da4e5e20359-us-east-1/Media/02 - Masturbating [Explicit].mp3',
                    url: 'https://wiredlifehacks.s3-us-west-2.amazonaws.com/wired-life-podcast.mp4',
                    ottsetInMilliseconds: handlerInput.requestEnvelope.context.AudioPlayer.offsetInMilliseconds
                }
            }
        })
        .getResponse();
    }
};

const BrodyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BrodyIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = 'He\'s a jackass <audio src="soundbank://soundlibrary/animals/amzn_sfx_monkey_calls_3x_01"/>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Anything else you would like to know, mother fuckers?")
            .getResponse();
    }
};

const BeNiceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BeNiceIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = 'Calm down, I was just joking, jeez.<audio src="soundbank://soundlibrary/human/amzn_sfx_crowd_boo_02"/>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("Don't be butt hurt")
            .getResponse();
    }
};



const BrodyReallyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BrodyReallyIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = 'He\'s a pretty good guy <audio src="soundbank://soundlibrary/human/amzn_sfx_large_crowd_cheer_03"/>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('I\'m outta here! <audio src="soundbank://soundlibrary/alarms/air_horns/air_horn_01"/> <audio src="soundbank://soundlibrary/human/amzn_sfx_human_walking_03"/>')
            .getResponse();
    }
};

const AnythingElseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnythingElseIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = '<audio src="soundbank://soundlibrary/human/amzn_sfx_clear_throat_ahem_01"/><amazon:emotion name="excited" intensity="low"><prosody rate="x-slow">Happy birthday to you, <break time= ".5s"/>happy birthday to you<break time= ".5s"/>, happy birthday dear brody<break time= ".5s"/>, happy birthday to you!<audio src="soundbank://soundlibrary/human/amzn_sfx_large_crowd_cheer_03"/></prosody></amazon:emotion>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('I\'m outta here! <audio src="soundbank://soundlibrary/alarms/air_horns/air_horn_01"/> <audio src="soundbank://soundlibrary/human/amzn_sfx_human_walking_03"/>')
            .getResponse();
    }
};

const OhShitIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OhShitIntent';
    },
    handle(handlerInput) {
        //const speakOutput = 'Hello World!';
        const speakOutput = '<amazon:emotion name="excited" intensity="medium">you fucked up! you fucked up! you fucked up!</amazon:emotion>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoadHackScoreInterceptor = {
    async process(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        
        //retrieve PERSISTENT attributes Object
        // if not defined, then set to empty object
        const sessionAttributes = await attributesManager.getPersistentAttributes() || {};
        
        // if hackscore is true, return the hackscore; otherwise set to -1
        const hackScore = sessionAttributes.hasOwnProperty('hackScore') ? sessionAttributes.hackScore : -1;
        
        // if score is -1, this is the first time the user is using the hack score
        if (hackScore === -1) {
            //set sessionAttributes
            sessionAttributes.newUser = true;
            sessionAttributes.hackScore = 0;
            
            attributesManager.setSessionAttributes(sessionAttributes);
        } else {
            // returning user; set hack score to value retrieved from S3
            // set session attributes
            sessionAttributes.hackScore = hackScore;
            attributesManager.setSessionAttributes(sessionAttributes);
        }
    }
};

const SaveHackScoreInterceptor = {
    async process(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        
        //retrieve SESSION attributes object 
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        
        console.log("hackScore in SaveHackScoreInterceptor is " + sessionAttributes.hackScore);
        
        // set and save current SESSION attributes to PERSISTENT attributes 
        attributesManager.setPersistentAttributes(sessionAttributes);
        await attributesManager.savePersistentAttributes(sessionAttributes);
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        LaunchRequestHandler,
        WiredLifeHacksIntentHandler,
        IncrementHackScoreIntentHandler,
        PlayPodcastIntentHandler,
        PauseAudioIntentHandler,
        ResumeAudioIntentHandler,
        BrodyIntentHandler,
        BeNiceIntentHandler,
        BrodyReallyIntentHandler,
        AnythingElseIntentHandler,
        OhShitIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addRequestInterceptors(
        LoadHackScoreInterceptor)
    .addResponseInterceptors(
        SaveHackScoreInterceptor)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();