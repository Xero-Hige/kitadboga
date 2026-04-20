function showYesNoFeedback(title,yesCallback,noCallback) {
    hideBotOverlay()
    let overlay = document.getElementById("feedback")

    document.getElementById("yesNoContainer").style.display = "flex"
    document.getElementById("surveyContainer").style.display = "none"

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

function showSurveyFeedback(title,callback) {
    hideBotOverlay()
    let overlay = document.getElementById("feedback")
    document.getElementById("yesNoContainer").style.display = "none"
    document.getElementById("surveyContainer").style.display = "flex"

    const textarea = document.getElementById('survey-input')
    const submitButton = document.getElementById('submit-survey')

    textarea.oninput = () => {
        submitButton.disabled = 500 > textarea.value.length
    }

    submitButton.onclick = ()=>{
        overlay.style.display = "none"
        callback()
    }

    overlay.style.display = "flex"
}