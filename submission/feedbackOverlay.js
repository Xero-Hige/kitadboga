function showYesNoFeedback(title,yesCallback,noCallback) {
    let overlay = document.getElementById("feedback")

    document.getElementById("feedback-yesno-title").innerText  = title
    document.getElementById("like-button").onclick = ()=>{
        overlay.style.display = "none"
        yesCallback()
    }
    document.getElementById("dislike-button").onclick = ()=>{
        overlay.style.display = "none"
        noCallback()
    }

    overlay.style.display = "flex"
}