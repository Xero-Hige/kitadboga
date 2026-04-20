//state
let skips_counter = 0
let skipping = false
let finished_count = 0

let videoDuration = 0
//---

function sendToParent(msg) {
    window.top.postMessage(msg, '*')
}

function sendToParentAsCallback(msg) {
    function __callback() {
        window.top.postMessage(msg, '*')
    }

    return __callback;
}

function sendAdFail() {
    sendToParent({type: "fail"})
}

function sendAdSuccess() {
    sendToParent({type: "success"})
}

function dismissOverlay() {
    document.getElementById('overlay-generation').style.display = 'none'
}

function generateVideoAd(callback) {
    const overlay = document.getElementById('overlay-generation')
    const bufferingMessage = document.getElementById('buffering-text')

    const baseBlur = 600;

    overlay.style.display = 'flex'

    function getBlurString(blur) {
        blur = Math.floor(blur)
        return `blur(${blur}px)`
    }

    overlay.style.backdropFilter = getBlurString(baseBlur);
    sendToParent({type: 'pause'})
    sendToParent({type: 'seekTo', value: 0.5+(0.25*Math.random())})
    bufferingMessage.innerHTML = "Generating video ad"


    function updateBackdrop(originalBlurRate, blurRate, message) {
        async function __callback() {
            for (let intermediateBlurRate = originalBlurRate;
                 intermediateBlurRate > blurRate;
                 intermediateBlurRate -= 0.01) {
                overlay.style.backdropFilter = getBlurString(baseBlur * intermediateBlurRate)
                await new Promise(r => setTimeout(r, 50))
            }

            if (message) {
                bufferingMessage.innerHTML = message
            }


            if (originalBlurRate === 0)
                overlay.style.backdropFilter = getBlurString(0)


        }

        return __callback;
    }

    hideBotOverlay()
    updateBackdrop()
    setTimeout(updateBackdrop(1, .8, "Generating Video"), 1000)
    setTimeout(updateBackdrop(0.8, 0.75), 2500)
    setTimeout(updateBackdrop(0.75, 0.5, "Optimizing"), 4000)
    setTimeout(updateBackdrop(0.5, 0.25, "Refining Lighting"), 5500)
    setTimeout(updateBackdrop(0.25, 0.05, "Sharpening Edges"), 7000)
    setTimeout(updateBackdrop(0.05, 0, "Syncing Audio"), 8500)
    setTimeout(updateBackdrop(0, 0), 9700)
    if (callback) setTimeout(callback, 10000)
    setTimeout(sendToParentAsCallback({type: 'play'}), 10000)
    setTimeout(dismissOverlay, 10000)
    setTimeout(skippingFlagCleanup,11000)
}

let slowReplayTimeoutId = null

function slowReplay() {
    document.getElementById("overlay-container").style.display = 'none'
    sendToParent({type: "setPlaybackRate", value: 0.5})

    let stopFn = () => sendToParent({type: 'pause'})
    let startFn = () => sendToParent({type: 'play'})

    let triggerWait = () => {
        stopFn()
        setTimeout(() => {
            alert("Press Ok to confirm you are watching")
            startFn()
        }, 150)

        slowReplayTimeoutId = setTimeout(triggerWait, 5000 + Math.floor(Math.random() * 5000))
    }

    generateVideoAd(triggerWait)
}

function slightlySlowReplay() {
    document.getElementById("overlay-container").style.display = 'none'
    document.getElementById("overlay-brand").style.display = 'none'
    sendToParent({type: "setPlaybackRate", value: 0.8})

    generateVideoAd()
}

//

function hideSkipButton() {
    document.getElementById('skip').style.display = 'none'
}

function animateSkipButton() {
    document.getElementById('skip').classList.add('animated')
}

function stopSkipButtonAnimation() {
    document.getElementById('skip').classList.remove('animated')
}

function skippingFlagCleanup(){
    skipping = false
}

function handleAdEnd(){
    hideEmojiOverlay()
    hideSkipButton()

    if (skipping)
        return

    finished_count++

    // Worst ending
    if (slowReplayTimeoutId) {
        clearTimeout(slowReplayTimeoutId)
        return scoldUser()
    }

    if (questionMode)
        return showFirtsQuestion()

    document.getElementById('skip').style.display = 'none'

    if (skips_counter === 0) {
        if (finished_count === 1)
            return userNeverSkipped()
        return praiseUser()
    }

    if (!shownBiggerEmojis && skips_counter===1)
        return askUserVideoLike()

    if (shownBiggerEmojis||(!shownBiggerEmojis && (skips_counter === 2)))
        return proposeProductToUser()
}

let shownBiggerEmojis = false

function handleSkip() {
    skipping = true
    skips_counter++
    hideSkipButton()

    if (questionMode)
        return showFirtsQuestion()

    if (skips_counter === 1)
        return userFirstSkip() //skips normal playback, renders emojis

    if (!shownBiggerEmojis && skips_counter === 2)
        return userSecondSkip()

    if (skips_counter === 2 || ( !shownBiggerEmojis && skips_counter === 3))
        return userThirdSkip(videoDuration)
}


function redirectToNothing(){
    sendToParent({type: "pause"})
    document.getElementById("overlay-nowebpage").style.display = 'flex'
    setTimeout(()=>{
        alert("Video provider timeout (missed 3 heartbeats): Forcing peer connection reset")
        sendAdFail()
    },20000)
}