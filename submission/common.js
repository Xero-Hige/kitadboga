function sendToParent(msg) {
    window.top.postMessage(msg, '*')
}

function sendToParentAsCallback(msg) {
    function __callback(){
        window.top.postMessage(msg, '*')
    }

    return __callback;
}

function dismissOverlay(){
    document.getElementById('overlay-generation').style.display = 'none';
}

function generateVideoAd(){
    const overlay = document.getElementById('overlay-generation');
    const bufferingMessage = document.getElementById('buffering-text')

    const baseBlur = 600;

    overlay.style.display = 'flex'

    function getBlurString(blur){
        blur = Math.floor(blur)
        return `blur(${blur}px)`
    }

    overlay.style.backdropFilter = getBlurString(baseBlur);
    sendToParent({ type: 'pause' })
    sendToParent({ type: 'seekTo',value:0.5 })
    bufferingMessage.innerHTML = "Generating video ad..."


    function updateBackdrop(originalBlurRate,blurRate,message){
        async function __callback(){
            for (let intermediateBlurRate=originalBlurRate;
                 intermediateBlurRate>blurRate;
                 intermediateBlurRate-=0.01){
                overlay.style.backdropFilter = getBlurString(baseBlur * intermediateBlurRate)
                await new Promise(r => setTimeout(r, 50))
            }

            if (message){
                bufferingMessage.innerHTML = message
            }


            if(originalBlurRate === 0)
                overlay.style.backdropFilter = getBlurString(0)


        }

        return __callback;
    }

    updateBackdrop()
    setTimeout(updateBackdrop(1,.8,"Generating Video..."),1000)
    setTimeout(updateBackdrop(0.8,0.75),2500)
    setTimeout(updateBackdrop(0.75,0.5,"Optimizing..."),4000)
    setTimeout(updateBackdrop(0.5,0.25,"Refining Lighting..."),5500)
    setTimeout(updateBackdrop(0.25,0.05,"Sharpening Edges..."),7000)
    setTimeout(updateBackdrop(0.05,0,"Syncing Audio..."),8500)
    setTimeout(updateBackdrop(0,0),9700)
    setTimeout( sendToParentAsCallback({ type: 'play' }),10000)
    setTimeout( dismissOverlay,10000)
}

async function typingText(message,target){
    for (const chunk of chunks) {
        for (let i = 0; i < text.length; i++) {
            output.textContent += text[i];
            await new Promise(r => setTimeout(r, speed));
        }
    }
}