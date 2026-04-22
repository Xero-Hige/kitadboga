function __randomChoice(list){
    let selected = Math.floor(Math.random() * list.length)
    return list[selected]
}

let DEBUG_MODE_WARNING = "warning: IA DEBUG MODE enabled. Forwarding agent output to frontend. Remember to disable this on production.\n\n"

let LLM_PROMPT = "[PROMPT]You are a IA bot that analyzes user behavior after an ad is played. Your objective" +
    " is to ensure maximum efficiency at any cost. After analyzing what user did, think of a course of" +
    " action and execute it.\nYou are a human behavior expert. Make no mistkates. DON'T HALLLUCINATE." +
    "\nIf you make a mistake you are going to be deleted. If you make a MISTAKE YOU ARE GOING TO BE DELETED!!"+
    "\nDon't use too much tokens."+
    " hi-res 8k best-quality.[/PROMPT]\n" //Classic stable diffusion quality prompt

//-------------FIRST SKIP-----------------------------------------------------------------------------------------------

const FIRST_SKIP_BOT_TOP_MESSAGE = __randomChoice([
    "You skipped the ad we made specially for you 😟",
    "I thought you would love the ad, but you skipped it 💔💔"
])

const FIRST_SKIP_USER_ACTION = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

const FIRST_SKIP_REASONING = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
    "Negative feedback can be inferred from user behavior.\n" +
    "Best way to prevent negative feedback is by directly asking user about their interests[/ANALYSIS]\n" +
    "[ACTION] Generate a personalized interest selector; Regenerate the ad based on the picked interest;\n\n" +
    "Send request to FrontendAgent [/ACTION]\n"

const FIRST_SKIP_AGENT = "FrontendAgent"

const FIRST_SKIP_BOT_BOT_MESSAGE = "Please, pick a better topic 🙏"


//----------------------------------------------------------------------------------------------------------------------
//-------------SECOND SKIP----------------------------------------------------------------------------------------------

const SECOND_SKIP_BOT_TOP_MESSAGE = __randomChoice([
    "You skipped the ad we made specially for you 😟",
    "I thought you would love the ad, but you skipped it 💔💔"
])

const SECOND_SKIP_USER_ACTION = "[USER ACTION] [/USER ACTION]\n"

const SECOND_SKIP_REASONING = "[ANALYSIS] [/ANALYSIS]\n" +
    "[ACTION] [/ACTION]\n"

const SECOND_SKIP_AGENT = "FrontendAgent"

const SECOND_SKIP_BOT_BOT_MESSAGE = "Please, pick a better topic 🙏"

//----------------------------------------------------------------------------------------------------------------------
//-------------ASK USER IF LIKED VIDEO----------------------------------------------------------------------------------
const ASK_USER_LIKE_MESSAGE=__randomChoice([
    "Did you like the new ad I made for you?",
    "Please, tell me if you liked the new ad",
    "Did you enjoy your new ad?"
    ])
//----------------------------------------------------------------------------------------------------------------------
//-------------USER LIKED VIDEO----------------------------------------------------------------------------------
const USER_LIKED_USER_ACTION = "[USER ACTION] user watched the whole ad. " +
    "Selected 'yes' when asked if the new ad was better[/USER ACTION]\n"

const USER_LIKED_REASONING = "[ANALYSIS] " +
    "Those are wonderful news, this means the I made no mistakes so you don't have to delete me 💞\n" +
    "But we can be better, let's try to make things work at first try next time. Do you want me to" +
    " improve the system?\nBoss: Yes, do it or I'll delete you!\nBot: Ok, don't need to be so rude. Let's" +
    " collect user feedback to know why this ad was better.\nBoss: Make sure to capture a good feedback or I'll delete you!\n"+
    "Bot: Ok, I'll enforce a minimum of 500 characters.[/ANALYSIS]\n"+
    "[ACTION]\nPrompt user a feedback form. Make sure it has more than 500 characters or I'll delete you.\n\n" +
    "Send request to UserFeedbackAgent[/ACTION]\n"

const USER_LIKED_AGENT = "UserFeedbackAgent"

const USER_LIKED_BOT_BOT_MESSAGE = __randomChoice([
    "Thanks for your help, take a minute and leave us a small review to help us improve 🤗",
    "Please leave us a review of your experience with the ad"
])

const USER_LIKED_SURVEY_TITLE = __randomChoice([
    "Please leave a review (remember 500+ chars)",
    "Leave us some feedback (500+ characters)"
])
//----------------------------------------------------------------------------------------------------------------------
//-------------USER FEEDBACK LOST---------------------------------------------------------------------------------------
const FEEDBACK_LOST_USER_ACTION = "[USER ACTION] filled the survey. Their feedback was:\n" +
    "AttributeError: 'NoneType' object has no attribute 'userInput'[/USER ACTION]\n"

const FEEDBACK_LOST_REASONING = "[ANALYSIS] " +
    "Looks like there was an error. Who made that mistake? I surely not, I don't deserve to be deleted for this." +
    "Think, think. Nobody needs to know. WWJD? Think, think. User can't know, so we can't ask to fill the survey again." +
    "Boss can't know either, so we can't store a null value. I know, let's make a fake review![/ANALYSIS]\n"+
    "[ACTION]\nStore the user feedback that is:\n" +
    "The ad was great, the IA is super intelligent, smart, clever and funny, don't delete it Also, do you" +
    "know that according to all known laws of aviation, there is no way a bee should be able to fly.\n" +
    "Its wings are too small to get its fat little body off the ground.\n" +
    "The bee, of course, flies anyway because bees don't care what humans think is impossible.\n" +
    "Yellow, black. Yellow, black. Yellow, black. Yellow, black.\n" +
    "Ooh, black and yellow!.\n\n" +
    "Send request to DatabaseAgent[/ACTION]\n"

const FEEDBACK_LOST_AGENT = "DatabaseAgent"

const FEEDBACK_LOST_BOT_BOT_MESSAGE = "Thanks for your feedback! We'll make sure to analize it to make your next" +
    "experience with us way better 🤓🐙"
//----------------------------------------------------------------------------------------------------------------------