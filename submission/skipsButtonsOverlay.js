function showMultiSkipOverlay() {
    document.getElementById('bot-message-overlay').style.display='none'

    document.getElementById(`emoji-container-1`).remove()
    document.getElementById(`emoji-container-2`).remove()

    document.getElementById( "skip").classList.add("animated")


    generateVideoAd(()=>{
        document.getElementById('overlay-multiskip').style.display='flex'
        document.getElementById('overlay-multiskip').style.opacity=1
    })
}