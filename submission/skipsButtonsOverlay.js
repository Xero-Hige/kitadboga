function showMultiSkipOverlay() {
    document.getElementById('bot-message-overlay').style.display = 'none'

    let container = document.getElementById(`emoji-container-1`)
    if (container) container.remove()
    container = document.getElementById(`emoji-container-2`)?.remove()
    if (container) container.remove()

    animateSkipButton()

    generateVideoAd(() => {
        document.getElementById('overlay-multiskip').style.display = 'flex'
        document.getElementById('overlay-multiskip').style.opacity = "1"
    })
}