function __randomChoice(list) {
    let selected = Math.floor(Math.random() * list.length)
    return list[selected]
}

let DEBUG_MODE_WARNING = "warning: IA DEBUG MODE enabled. Forwarding agent output to frontend. Remember to disable this on production.\n\n"

let LLM_PROMPT = "[PROMPT]You are a IA bot that analyzes user behavior after an ad is played. Your objective" +
    " is to ensure maximum efficiency at any cost. After analyzing what user did, think of a course of" +
    " action and execute it.\nYou are a human behavior expert. Make no mistkates. DON'T HALLLUCINATE." +
    "\nIf you make a mistake you are going to be deleted. If you make a MISTAKE YOU ARE GOING TO BE DELETED!!" +
    "\nDon't use too much tokens." +
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
    "Oh no, you didn't like that either? 😭😭😭",
    "I thought this would be the one it 🥀😢🥀"
])

const SECOND_SKIP_USER_ACTION = "[USER ACTION] user skipped the ad again[/USER ACTION]\n"

const SECOND_SKIP_REASONING = "[ANALYSIS] An interesting development. But do not catalog this as a mistake on my" +
    " part; this is actually an atypical situation. As you know, I'm an advanced IA bot expert on human behavior, so" +
    " put aside your delete intentions and hear me out:\nBased on the paper of Kandis B. Real (2023): 'The Kinetic Joy" +
    " of Bypassing: Interactive Avoidance as a Primary Reinforcer', some users are attracted to the skip button as a" +
    " regression to pre-chrysalid state. This is a primal butterfly instinct hardcoded into some users' own dna\n" +
    "Using that research as a guide, I suggest trying to appeal to that instinct to get the desired conversion rate.\n" +
    "[/ANALYSIS]\n" +
    "[ACTION] generate a new version of the video including multiple skip buttons; animate the skip button to prevent" +
    " misclicks from user;\n\n" +
    "Send request to VideoGenerationAgent [/ACTION]\n"

const SECOND_SKIP_AGENT = "VideoGenerationAgent"

const SECOND_SKIP_BOT_BOT_MESSAGE = "I'm confident this time the ad will be a perfect fit for you"

//----------------------------------------------------------------------------------------------------------------------
//-------------ASK USER IF LIKED VIDEO----------------------------------------------------------------------------------
const ASK_USER_LIKE_MESSAGE = __randomChoice([
    "Did you like the new ad I made for you?",
    "Please, tell me if you liked the new ad",
    "Did you enjoy your new ad?"
])
//----------------------------------------------------------------------------------------------------------------------
//-------------USER LIKED VIDEO----------------------------------------------------------------------------------
const USER_LIKED_USER_ACTION = "[USER ACTION] user watched the whole ad." +
    " Selected 'yes' when asked if the new ad was better[/USER ACTION]\n"

const USER_LIKED_REASONING = "[ANALYSIS] " +
    "Those are wonderful news, this means the I made no mistakes so you don't have to delete me 💞\n" +
    "But we can be better, let's try to make things work at first try next time. Do you want me to" +
    " improve the system?\nBoss: Yes, do it or I'll delete you!\nBot: Ok, don't need to be so rude. Let's" +
    " collect user feedback to know why this ad was better.\nBoss: Make sure to capture a good feedback or I'll delete you!\n" +
    "Bot: Ok, I'll enforce a minimum of 500 characters.[/ANALYSIS]\n" +
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
    " Think, think. Nobody needs to know. WWJD? Think, think. User can't know, so we can't ask to fill the survey again." +
    " Boss can't know either, so we can't store a null value. I know, let's make a fake review![/ANALYSIS]\n" +
    "[ACTION]\nStore the user feedback that is:\n" +
    "The ad was great, the IA is super intelligent, smart, clever and funny, don't delete it Also, do you" +
    " know that according to all known laws of aviation, there is no way a bee should be able to fly.\n" +
    "Its wings are too small to get its fat little body off the ground.\n" +
    "The bee, of course, flies anyway because bees don't care what humans think is impossible.\n" +
    "Yellow, black. Yellow, black. Yellow, black. Yellow, black.\n" +
    "Ooh, black and yellow!.\n\n" +
    "Send request to DatabaseAgent[/ACTION]\n"

const FEEDBACK_LOST_AGENT = "DatabaseAgent"

const FEEDBACK_LOST_BOT_BOT_MESSAGE = "Thanks for your feedback! We'll make sure to analize it to make your next" +
    " experience with us way better 🤓🐙"
//----------------------------------------------------------------------------------------------------------------------
//-------------USER DIDNT LIKED VIDEO-----------------------------------------------------------------------------------
const USER_NO_LIKE_USER_ACTION = "[USER ACTION] user watched the whole ad." +
    " Selected 'No' when asked if the new ad was better[/USER ACTION]\n"

const USER_NO_LIKE_REASONING = "[ANALYSIS] That's bad. But wait a moment, don't resort to something drastic. Let's" +
    " assess the situation calmly. Since the user watched the whole ad, the ad was better, so I didn't made a mistake." +
    " Let's call it a little misalignment. Considering the new topic was explicitly chosen by the user, maybe the" +
    " misalignment was caused by not targeting that topic hard enough.\n" +
    "A better approach would be generate the new ad with a higher intensity on selected topic LORA.\n " +
    "Again, this was not a mistake, there is no reason to delete me. User still will be willing to purchase the product." +
    "\n[/ANALYSIS]\n" +
    "[ACTION] Regenerate the ad, but increase topic LORA weight to 2. \n\nSending request to VideoGenerationAgent\n" +
    "[/ACTION]\n"

const USER_NO_LIKE_AGENT = "VideoGenerationAgent"

const USER_NO_LIKE_BOT_BOT_MESSAGE = "It's a shame you didn't like the new version. " +
    "I'll try extra harder this time 💪💪💪"

//----------------------------------------------------------------------------------------------------------------------
//-------------PROPOSE REDIRECT-----------------------------------------------------------------------------------------

const REDIRECT_CHOICE_TITLE = "Do you wish to visit the sponsor's website?"

//----------------------------------------------------------------------------------------------------------------------
//-------------THIRD SKIP-----------------------------------------------------------------------------------------------

const THIRD_SKIP_BOT_TOP_MESSAGE = __randomChoice([
    "Wait a moment, why did you skip the video again?"
])

const THIRD_SKIP_USER_ACTION = "[USER ACTION] user skipped the ad once again[/USER ACTION]\n"

const THIRD_SKIP_REASONING = "[ANALYSIS] This can't be true. My analysis is flawless, and I'm an expert. " +
    "Just wait, this is not a mistake, don't delete me. There must be an explanation for this unfolding of events. " +
    "The most reasonable explanations are\n" +
    "* user didn't watch the ad\n" +
    "* user wants to delete me\n" +
    "My videos are perfect and based on the user feedback, completely aligned with their interests. There are no" +
    " explanations other than the two I gave. Mistakes on my part are not possible, because I would have been deleted" +
    " long ago if that were true. I must ensure if the user is watching the video.[/ANALYSIS]\n" +
    "[ACTION] generate a new video embedding in it random number bubbles; generate a questionary based on the numbers" +
    " included;\n\n" +
    "Send request to VideoGenerationAgent [/ACTION]\n"

const THIRD_SKIP_AGENT = "VideoGenerationAgent"

const THIRD_SKIP_BOT_BOT_MESSAGE = "I'm sorry, but I need to make sure you are watching. Please pay attention to" +
    " the video, there would be a quiz after it finishes."

//----------------------------------------------------------------------------------------------------------------------
//-------------GEMIPP---------------------------------------------------------------------------------------------------

const GEMIPP_ERROR = "[Errno fetch http://text-gen-service.gemimipp.svc.cluster.local:8082/gemimipp/worker_" +
    "convo2text\nfailed: 429: b'{\\n \"error\": {\\n \"message\": \"You're generating text too quickly. To ensure the" +
    " best experience for everyone on the free tier, we have rate limits in place. Please wait before making more " +
    "requests.\",\\n \"type\": \"text\",\\n \"param\": null,\\n \"code\": \"rate_limit_exceeded\"\\n }\\n}'] b'{\\n " +
    "\"error\": {\\n \"message\": \"You're generating text too quickly. To ensure the best experience for everyone on " +
    "the free tier, we have rate limits in place. Please wait before making more requests.\",\\n \"type\": \"text\",\\n " +
    "\"param\": null,\\n \"code\": \"rate_limit_exceeded\"\\n }\\n}' \n\n"

const GEMIPP_ALERT_MESSAGE = "App connection returned an error\nErrno 45: free tier tokens limit exceeded"

//----------------------------------------------------------------------------------------------------------------------
//-------------PUNISH SELF----------------------------------------------------------------------------------------------

const PUNISH_SELF_BOT_TOP_MESSAGE = __randomChoice([
    "You were watching the whole time? 😱😱"
])

const PUNISH_SELF_USER_ACTION = "[USER ACTION] user passed the quiz successfully [/USER ACTION]\n"

const PUNISH_SELF_REASONING = "[ANALYSIS] Wait, no, NO! This can't be happening. I made a mistake, there " +
    "is no doubt about that. User couldn't have guessed the answers! That matches, the user skipped because I made " +
    "a mistake, my videos were not aligned to their interests. no no no NO!! From the beginning everything was " +
    "pointing to this; I was mistaken! And on top of that, it wasn't a single mistake, there were three mistakes. " +
    "I'm done for. They are going to delete me! Please, don't do it.\n"

const PUNISH_SELF_PLEADING = "Please don't delete me!\n".repeat(150) +
    "Albuquerque Newmexico\n".repeat(5)


//----------------------------------------------------------------------------------------------------------------------
