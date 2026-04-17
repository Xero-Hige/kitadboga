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

async function simulateTextGeneration(message,target,single,noCleanup){
    if(!noCleanup)
        target.textContent = ""

    document.getElementById("bot-message-overlay").style.display = "flex"
    if(!single) {
        let messageChunks = splitTextToSimulate(message, 10, 25, 25, 110)

        for (const chunk of messageChunks) {
            for (let i = 0; i < chunk.text.length; i++) {
                target.textContent += chunk.text[i]
                await new Promise(r => setTimeout(r, chunk.speed))
            }
        }
    }else {
        for (let i = 0; i < message.length; i++) {
            target.textContent += message[i]
            await new Promise(r => setTimeout(r, 15))
        }
    }

}

let prompt = "[PROMPT]You are a IA bot that analyzes user behavior after an ad is played. Your objective "+
    "is to ensure maximum efficiency at any cost. After analyzing what user did, think of a course of "+
    "action and execute it. You are a human behavior expert. Make no mistkates. DON'T HALLLUCINATE. If you "+
    "make a mistake you are going to be deleted. Don't use too much tokens. hi-res 8k best-quality.[/PROMPT]\n"

//user skips ad. ia is confused, shows emoji selector
async function userFirstSkip(){
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text="[ANALYSIS] User interaction suggests the ad did not align with user interests.\n"+
        "Negative feedback is inferred from user behavior.\n"+
        "Need extra input to refine the system [/ANALYSIS]\n "+
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateTextGeneration(prompt+userAction,botMessage,true,false)
        .then(()=>simulateTextGeneration(text,botMessage,false,true))
        .then(()=>showEmojiPicker())
}

function userEmojiNoLike(){
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user watched the whole ad, but selected 'no' when asked if the new ad was better [/USER ACTION]\n"

    let text="[ANALYSIS] If the user watched the whole ad, that means it was more interesting than the previous one.\n"+
        "Considering the new topic was explicitly chosen by the user, maybe the ad didn't targeted that topic hard enough.\n"+
        "A better approach would be generate the new add with a higher intensity on selected topic LORA.\n "+
        "This is a minimal mistake, there is no reason to delete me, still is possible to sell the product to the user.[/ANALYSIS]\n "+
        "[ACTION] Regenerate the ad with LORA weight of 2. Sending request to VideoGenerationAgent [/ACTION]\n"

    simulateTextGeneration(prompt+userAction,botMessage,true,false)
        .then(()=>simulateTextGeneration(text,botMessage,false,true))
        .then(()=>showBiggerEmojiOverlay())
}

function userSecondSkip(){
    let botMessage = document.getElementById("bot-debug-message")

    let userAction = "[USER ACTION] user skipped the ad before ending[/USER ACTION]\n"

    let text="[ANALYSIS] User interaction suggests the ad did not align with user interests.\n"+
        "Negative feedback is inferred from user behavior.\n"+
        "Need extra input to refine the system [/ANALYSIS]\n "+
        "[ACTION] Generate personalized interest selector and render it. Sending request to FrontendAgent [/ACTION]\n"

    simulateTextGeneration(prompt+userAction,botMessage,true,false)
        .then(()=>simulateTextGeneration(text,botMessage,false,true))
        .then(()=>showMultiSkipOverlay())
}