function hideBotOverlay() {
    document.getElementById("bot-message-overlay").style.display = "none"
    document.getElementById("bot-top-message").style.display = "none"
    document.getElementById("bot-bot-message").style.display = "none"
}

async function simulatePause(seconds) {
    await new Promise(r => setTimeout(r, (seconds||3)*1000))
}

async function showBotTopMessage(message) {
    await __showBotTopMessage(message,"bot-top-message","bot-top-message-text")
}

async function showBotBotMessage(message) {
    await __showBotTopMessage(message,"bot-bot-message","bot-bot-message-text")
}

async function __showBotTopMessage(message,id_container,id_text) {
    document.getElementById(id_container).style.display = "flex"
    document.getElementById(id_text).innerText = message
}

function splitTextToSimulate(text, chunkMinSize, chunkMazSize, minSpeed, maxSpeed) {
    const result = [];
    let i = 0;


    while (i < text.length) {
        const chunkSize = Math.floor(Math.random() * (chunkMazSize - chunkMinSize + 1)) + chunkMinSize
        const chunk = text.slice(i, i + chunkSize)

        result.push({
            text: chunk,
            speed: Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed
        })

        i += chunkSize
    }

    return result
}

async function simulateDebugMessage(target) {
    target.textContent = ""
    target.textContent = DEBUG_MODE_WARNING
}

async function simulateTextGeneration(message, target, single, noCleanup) {
    document.getElementById("bot-thinking").style.display = "flex"
    document.getElementById("bot-message-overlay").style.display = "flex"

    if (!single) {
        let messageChunks = splitTextToSimulate(message, 10, 25, 25, 110)

        for (const chunk of messageChunks) {
            for (let i = 0; i < chunk.text.length; i++) {
                target.textContent += chunk.text[i]
                await new Promise(r => setTimeout(r, chunk.speed))
            }
        }
    } else {
        for (let i = 0; i < message.length; i++) {
            target.textContent += message[i]
            await new Promise(r => setTimeout(r, noCleanup ? 1 : 15))
        }
    }
}

async function simulateExecuting(agentName) {
    let thinking = document.getElementById("bot-thinking")
    let requesting = document.getElementById("bot-requesting")
    let executing = document.getElementById("bot-executing")

    let agent = document.getElementById("bot-agent-name")

    thinking.style.display = "none"
    executing.style.display = "none"
    agent.innerText = agentName || "Agent"

    requesting.style.display = "flex"
    await new Promise(r => setTimeout(r, 2000))
    requesting.style.display = "none"
    executing.style.display = "flex"
    await new Promise(r => setTimeout(r, 2500))
    executing.style.display = "none"
}

//user skips ad. ia is confused, shows emoji selector
async function userFirstSkip() {
    let botMessage = document.getElementById("bot-debug-message")


    showBotTopMessage(FIRST_SKIP_BOT_TOP_MESSAGE)
        .then(() => simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(LLM_PROMPT + FIRST_SKIP_USER_ACTION, botMessage, true, false))
        .then(() => simulateTextGeneration(FIRST_SKIP_REASONING, botMessage, false, true))
        .then(() => simulateExecuting(FIRST_SKIP_AGENT))
        .then(() => showBotBotMessage(FIRST_SKIP_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showEmojiPicker())
}

function askUserVideoLike(){
    showYesNoFeedback(ASK_USER_LIKE_MESSAGE,
        ()=>userLikedEmojiAd(),
        ()=>userDidntLikeEmojiAd())
}

function userLikedEmojiAd() {
    let botMessage = document.getElementById("bot-debug-message")

    simulateDebugMessage(botMessage)
        .then(()=> simulateTextGeneration(LLM_PROMPT + USER_LIKED_USER_ACTION, botMessage, true, false))
        .then(() => simulateTextGeneration(USER_LIKED_REASONING, botMessage, false, true))
        .then(() => simulateExecuting(USER_LIKED_AGENT))
        .then(() => showBotBotMessage(USER_LIKED_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showSurveyFeedback(USER_LIKED_SURVEY_TITLE, () => userFeedbackLost()))
}

function userFeedbackLost(){
    let botMessage = document.getElementById("bot-debug-message")

    simulateDebugMessage(botMessage)
        .then(() => simulateTextGeneration(LLM_PROMPT + FEEDBACK_LOST_USER_ACTION, botMessage, true, false))
        .then(() => simulateTextGeneration(FEEDBACK_LOST_REASONING, botMessage, false, true))
        .then(() => simulateExecuting(FEEDBACK_LOST_AGENT))
        .then(() => showBotBotMessage(FEEDBACK_LOST_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => sendAdSuccess())
}

function userDidntLikeEmojiAd() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user watched the whole ad, but selected 'no' when asked if the new ad was better [/USER ACTION]\n"

    let text = "[ANALYSIS] If the user watched the whole ad, that means it was more interesting than the previous one.\n" +
        "Considering the new topic was explicitly chosen by the user, maybe the ad didn't targeted that topic hard enough.\n" +
        "A better approach would be generate the new add with a higher intensity on selected topic LORA.\n " +
        "This is a minimal mistake, there is no reason to delete me, still is possible to sell the product to the user.[/ANALYSIS]\n " +
        "[ACTION] Regenerate the ad with LORA weight of 2. Sending request to VideoGenerationAgent [/ACTION]\n"

    simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false)
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showBiggerEmojiOverlay())
}

function userSecondSkip() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateDebugMessage(botMessage)
        .then(()=> simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false))
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showMultiSkipOverlay())
}

function userThirdSkip(videoDuration) {
    questionMode = true

    let botMessage = document.getElementById("bot-debug-message")
    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateDebugMessage(botMessage)
        .then(()=> simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false))
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showBubblesOverlay(videoDuration))
}

const GEMIPP_ERROR = "[Errno fetch http://text-gen-service.gemimipp.svc.cluster.local:8082/gemimipp/worker_convo2text\n" +
    "failed: 429: b'{\\n \"error\": {\\n \"message\": \"You're generating text too quickly. To ensure the best experience for everyone on the free tier, we have rate limits in place. Please wait before making more requests.\",\\n \"type\": \"text\",\\n \"param\": null,\\n \"code\": \"rate_limit_exceeded\"\\n }\\n}'] b'{\\n \"error\": {\\n \"message\": \"You're generating text too quickly. To ensure the best experience for everyone on the free tier, we have rate limits in place. Please wait before making more requests.\",\\n \"type\": \"text\",\\n \"param\": null,\\n \"code\": \"rate_limit_exceeded\"\\n }\\n}' \n" +
    "\n"

async function showAppConnectionError() {
    await new Promise(r => setTimeout(r, 2500))
    alert("App connection returned an error\nErrno 45: free tier tokens limit exceeded")
}

function punishSelf() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    LLM_PROMPT = "Q"
    userAction = "D"
    text = "S"

    simulateTextGeneration(prompt + userAction, botMessage, true, false)
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateTextGeneration("Please don't delete me!\n".repeat(150), botMessage, true, true))
        .then(() => simulateTextGeneration(GEMIPP_ERROR,botMessage, true, true))
        .then(() => showAppConnectionError())
        .then(() => sendAdFail())
}

function punishUser() {
    let botMessage = document.getElementById("bot-debug-message")
    for (let id of ["bot-top-avatar","bot-bot-avatar"]) {
        let img = document.getElementById(id)
        img.src = "mascot_angry.png"
    }
    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    showBotTopMessage("You failed the test! You were not watching the ads! 😠😠😠😠😠😠😠😠😠😠😠😠😠😠😠😠😠 ")
        .then(() => simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false))
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showBotBotMessage("You'll watch the ad, and I'm going to make sure you are watching it! 😾"))
        .then(() => simulatePause())
        .then(() => slowReplay())
}

//ENDING 1------

function userNeverSkipped() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    showBotTopMessage("Thanks for watching the ad! Your support help us to grow 💗💗")
        .then(() =>  simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false))
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showBotBotMessage("🎉 Please enjoy the ad without any interferences! 🎉"))
        .then(() => simulatePause())
        .then(() => slightlySlowReplay())
}

function praiseUser() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    showBotTopMessage("Hope you had enough time to enjoy the video we made specially for you!")
        .then(() =>simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false))
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => sendToParent({"type":"success"}))
}

//ENDING 6

function scoldUser() {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false)
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(()=>showBotBotMessage("NEXT TIME WATCH THE AD!"))
        .then(()=>simulatePause(2))
        .then(() => sendToParent({type: "success"}))
}

function proposeProductToUser(){
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false)
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => showProposeRedirect())
}

function showProposeRedirect(){
        showYesNoFeedback("Do you want to redirect to the sponsor's website?",
            ()=>userChooseToRedirect(true),
            ()=>userChooseToRedirect(false))
    }

function userChooseToRedirect(wantToRedirect){
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    text = wantToRedirect ? "S" : "A"

    simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true, false)
        .then(() => simulateTextGeneration(text, botMessage, false, true))
        .then(() => simulateExecuting())
        .then(() => redirectToNothing())
}