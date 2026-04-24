function hideBotOverlay() {
    document.getElementById("bot-message-overlay").style.display = "none"
    document.getElementById("bot-top-message").style.display = "none"
    document.getElementById("bot-bot-message").style.display = "none"
}

async function simulatePause(seconds) {
    await new Promise(r => setTimeout(r, (seconds || 3) * 1000))
}

async function showBotTopMessage(message) {
    document.getElementById("bot-debug-message").style.display = "none"
    await __showBotTopMessage(message, "bot-top-message", "bot-top-message-text")
}

async function showBotBotMessage(message) {
    await __showBotTopMessage(message, "bot-bot-message", "bot-bot-message-text")
}

async function __showBotTopMessage(message, id_container, id_text) {
    document.getElementById(id_container).style.display = "flex"

    return simulateTextGeneration(message, document.getElementById(id_text), false, true, true)
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

async function attachText(message, target) {
    target.textContent = target.textContent + message
}

async function simulateTextGeneration(message, target, single, cleanup, noThinking) {
    if (cleanup)
        target.textContent = ""

    target.style.display = "flex"

    if (!noThinking) //I know, but is a single var on a single line rather than updating everything
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
            await new Promise(r => setTimeout(r, 10))
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
        .then(() => simulateTextGeneration(LLM_PROMPT + FIRST_SKIP_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(FIRST_SKIP_REASONING, botMessage, false))
        .then(() => simulateExecuting(FIRST_SKIP_AGENT))
        .then(() => showBotBotMessage(FIRST_SKIP_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showEmojiPicker())
}

function askUserVideoLike() {
    showYesNoFeedback(ASK_USER_LIKE_MESSAGE,
        () => userLikedEmojiAd(),
        () => userDidntLikeEmojiAd())
}

function userLikedEmojiAd() {
    let botMessage = document.getElementById("bot-debug-message")

    simulateDebugMessage(botMessage)
        .then(() => simulateTextGeneration(LLM_PROMPT + USER_LIKED_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(USER_LIKED_REASONING, botMessage, false))
        .then(() => simulateExecuting(USER_LIKED_AGENT))
        .then(() => showBotBotMessage(USER_LIKED_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showSurveyFeedback(USER_LIKED_SURVEY_TITLE, () => userFeedbackLost()))
}

function userFeedbackLost() {
    let botMessage = document.getElementById("bot-debug-message")

    simulateDebugMessage(botMessage)
        .then(() => simulateTextGeneration(LLM_PROMPT + FEEDBACK_LOST_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(FEEDBACK_LOST_REASONING, botMessage, false))
        .then(() => simulateExecuting(FEEDBACK_LOST_AGENT))
        .then(() => showBotBotMessage(FEEDBACK_LOST_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => sendAdSuccess())
}

function userDidntLikeEmojiAd() {
    let botMessage = document.getElementById("bot-debug-message")

    simulateDebugMessage(botMessage)
        .then(() => simulateTextGeneration(LLM_PROMPT + USER_NO_LIKE_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(USER_NO_LIKE_REASONING, botMessage, false))
        .then(() => simulateExecuting(USER_NO_LIKE_AGENT))
        .then(() => showBotBotMessage(USER_NO_LIKE_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showBiggerEmojiOverlay())
}

function userSecondSkip() {
    let botMessage = document.getElementById("bot-debug-message")

    showBotTopMessage(SECOND_SKIP_BOT_TOP_MESSAGE)
        .then(() => simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(LLM_PROMPT + SECOND_SKIP_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(SECOND_SKIP_REASONING, botMessage, false))
        .then(() => simulateExecuting(SECOND_SKIP_AGENT))
        .then(() => showBotBotMessage(SECOND_SKIP_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showMultiSkipOverlay())
}

function userThirdSkip(videoDuration) {
    questionMode = true

    let botMessage = document.getElementById("bot-debug-message")
    showBotTopMessage(THIRD_SKIP_BOT_TOP_MESSAGE)
        .then(() => simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(LLM_PROMPT + THIRD_SKIP_USER_ACTION, botMessage, true,))
        .then(() => simulateTextGeneration(THIRD_SKIP_REASONING, botMessage, false))
        .then(() => simulateExecuting(THIRD_SKIP_AGENT))
        .then(() => showBotBotMessage(THIRD_SKIP_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => showBubblesOverlay(videoDuration))
}

async function showAppConnectionError() {
    await new Promise(r => setTimeout(r, 2500))
    alert(GEMIPP_ALERT_MESSAGE)
}

function punishSelf() {
    let botMessage = document.getElementById("bot-debug-message")

    showBotTopMessage(PUNISH_SELF_BOT_TOP_MESSAGE)
        .then(() => simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(prompt + PUNISH_SELF_USER_ACTION, botMessage, true)
            .then(() => simulateTextGeneration(PUNISH_SELF_REASONING, botMessage, false))
            .then(() => simulateTextGeneration(PUNISH_SELF_PLEADING, botMessage, true))
            .then(() => simulatePause(2))
            .then(() => attachText(GEMIPP_ERROR, botMessage))
            .then(() => simulatePause(6)))
        .then(() => showAppConnectionError())
        .then(() => sendAdFail())
}

//ENDING 1------

function userNeverSkipped() {
    let botMessage = document.getElementById("bot-debug-message")

    showBotTopMessage(DIDNT_SKIP_BOT_TOP_MESSAGE)
        .then(()=>simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(LLM_PROMPT + DIDNT_SKIP_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(DIDNT_SKIP_REASONING, botMessage, false))
        .then(() => simulateExecuting(DIDNT_SKIP_AGENT))
        .then(() => showBotBotMessage(DIDNT_SKIP_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => slightlySlowReplay())
}

function praiseUser() {
    showBotTopMessage(PRAISE_USER_BOT_TOP_MESSAGE)
        .then(() => simulatePause())
        .then(() => sendToParent({"type": "success"}))
}

//ENDING 6
function punishUser() {
    let botMessage = document.getElementById("bot-debug-message")
    for (let id of ["bot-top-avatar", "bot-bot-avatar"]) {
        let img = document.getElementById(id)
        img.src = "mascot_angry.png"
    }

    showBotTopMessage(PUNISH_USER_BOT_TOP_MESSAGE)
        .then(()=>simulateDebugMessage(botMessage))
        .then(() => simulateTextGeneration(LLM_PROMPT + PUNISH_USER_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(PUNISH_USER_REASONING, botMessage, false))
        .then(() => simulateExecuting(PUNISH_USER_AGENT))
        .then(() => showBotBotMessage(PUNISH_USER_BOT_BOT_MESSAGE))
        .then(() => simulatePause())
        .then(() => slowReplay())
}

function scoldUser() {
    showBotBotMessage(SCOLD_USER_BOT_TOP_MESSAGE)
        .then(() => simulatePause(3))
        .then(() => sendToParent({type: "success"}))
}

function proposeProductToUser() {
    let botMessage = document.getElementById("bot-debug-message")

    let text = "[ANALYSIS] User interaction suggests the ad did not align with user interests.\n" +
        "Negative feedback is inferred from user behavior.\n" +
        "Need extra input to refine the system [/ANALYSIS]\n " +
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    showBotTopMessage(PROPOSE_REDIRECT_BOT_TOP_MESSAGE)
        .then(()=>simulateDebugMessage(botMessage))
        .then(()=>simulateTextGeneration(LLM_PROMPT + PROPOSE_REDIRECT_USER_ACTION, botMessage, true))
        .then(() => simulateTextGeneration(text, botMessage, false))
        .then(() => simulateExecuting(PROPOSE_REDIRECT_AGENT))
        .then(()=>simulatePause(1))
        .then(() => showProposeRedirect())
}

function showProposeRedirect() {
    showYesNoFeedback(REDIRECT_CHOICE_TITLE,
        () => userChooseToRedirect(true),
        () => userChooseToRedirect(false))
}

function userChooseToRedirect(wantToRedirect) {
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = wantToRedirect ? WANTS_REDIRECT_USER_ACTION:NO_WANTS_REDIRECT_USER_ACTION

    let reasoning = wantToRedirect ? WANTS_REDIRECT_REASONING:NO_WANTS_REDIRECT_REASONING

    simulateDebugMessage(botMessage)
        .then(()=>    simulateTextGeneration(LLM_PROMPT + userAction, botMessage, true))
        .then(() => simulateTextGeneration(reasoning, botMessage, false))
        .then(() => simulateExecuting(WANTS_REDIRECT_AGENT))
        .then(()=>showBotBotMessage(WANTS_REDIRECT_BOT_BOT_MESSAGE))
        .then(()=>simulatePause())
        .then(() => redirectToNothing())
}