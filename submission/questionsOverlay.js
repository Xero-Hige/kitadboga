function generateRandomColorString() {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return [`rgb(${r},${g},${b})`, (brightness > 125 ? "black" : "white")]
}


const numbers = Array.from({length: 1000}, (_, i) => i).sort((a, b) => Math.random() - 0.5)
const colors = Array.from({length: 20}, () => generateRandomColorString())

function spawnBubble(startTime, number, colorConfig) {
    const overlay = document.getElementById('overlay-bubbles')

    let [backgroundColor, fontColor] = colorConfig

    const bubble = document.createElement('div')
    bubble.classList.add('bubble')

    bubble.innerHTML = number
    bubble.style.background = backgroundColor
    bubble.style.color = fontColor

    bubble.style.top = (Math.floor(Math.random() * 90) + 5) + '%'
    bubble.style.left = (Math.floor(Math.random() * 90) + 5) + '%'

    setTimeout(() => overlay.append(bubble), startTime)
    setTimeout(() => bubble.remove(), startTime + (Math.random() * 1500))
}

function spawnItems(videoLength) {
    videoLength -= 2

    let startTimes = []

    for (let i = 0; i < videoLength; i++) {
        let startTime = Math.floor(Math.random() * 1000 * videoLength)
        startTimes.push(startTime)
    }

    for (let i = 0; i < 5; i++)
        spawnBubble(startTimes[i], numbers[i], colors[i])
}

function showBubblesOverlay(videoLength) {
    document.getElementById('bot-message-overlay').style.display = 'none'

    let container = document.getElementById(`emoji-container-2`)
    if (container) container.remove()
    container = document.getElementById(`overlay-multiskip`)
    if (container) container.remove()

    document.getElementById(`overlay-bubbles`).style.display = "flex"

    generateVideoAd(() => spawnItems(videoLength))
}


function showQuestionsOverlay() {
    document.getElementById(`overlay-bubbles`).remove()

}

let skipped = 0
let incorrectAnswers = 0

let questionMode = false

function showFirtsQuestion() {
    questionMode = true
    stopSkipButtonAnimation()
    const questionForm = document.getElementById('FirstQuestion')
    const options = questionForm.querySelectorAll('button')

    document.getElementById('firstQuestion-number').innerText = numbers[2].toString()

    let [correct, incorrect] = options
    if (colors[2][1] === "black")
        [incorrect, correct] = options

    correct.onclick = () => {
        questionForm.style.display = "none"
        showSecondQuestion()
    }
    incorrect.onclick = () => {
        incorrectAnswers++
        questionForm.style.display = "none"
        showSecondQuestion()
    }

    document.getElementById('overlay-questions').style.display = 'flex'
    questionForm.style.display = "flex"
}

function showSecondQuestion() {
    const questionForm = document.getElementById('SecondQuestion')

    const options = questionForm.querySelectorAll('button')

    document.getElementById('secondQuestion-bubble').style.background = colors[0][0]

    const pairs = [[-4, -2], [-2, -1], [-2, 2], [-1, 1], [1, 2], [2, 4]]
    const [distance0A, distance0B] = pairs[Math.floor(Math.random() * pairs.length)]
    const [distance3A, distance3B] = pairs[Math.floor(Math.random() * pairs.length)]
    let answers = [numbers[0], numbers[0] + distance0A, numbers[0] + distance0B, numbers[3], numbers[3] + distance3A, numbers[3] + distance3B]

    const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

    options.forEach((optionButton, idx) => {
        optionButton.innerText = shuffledAnswers[idx]

        optionButton.onclick = () => {
            if (shuffledAnswers[idx] !== numbers[0])
                incorrectAnswers++

            questionForm.style.display = "none"
            showThirdQuestion();
        };
    });

    questionForm.style.display = "flex"
}


function showThirdQuestion() {
    const questionForm = document.getElementById('ThirdQuestion')

    const options = questionForm.querySelectorAll('button')

    document.getElementById('thirdQuestion-number').innerText = numbers[4].toString()

    let answers = [colors[4], colors[6], colors[7], colors[0], colors[9], colors[1]]

    const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

    options.forEach((optionButton, idx) => {
        optionButton.style.background = shuffledAnswers[idx][0]
        optionButton.style.color = shuffledAnswers[idx][1]
        optionButton.innerText = numbers[4].toString()

        if (shuffledAnswers[idx] === colors[4])
            console.log(idx)

        optionButton.onclick = () => {
            if (shuffledAnswers[idx] !== colors[4])
                incorrectAnswers++

            questionForm.style.display = "none"
            analizeAnswers();
        };
    });

    questionForm.style.display = "flex"
}

function analizeAnswers() {
    if (incorrectAnswers >= 2)
        return punishUser()

    if (skipped || incorrectAnswers > 0)
        return showFakeAnswer()

    punishSelf()
}

function showFakeAnswer() {
    const questionForm = document.getElementById('FourthQuestion')
    questionForm.style.display = "flex"

    const options = questionForm.querySelectorAll('button')
    options.forEach((optionButton, idx) => {
        optionButton.onclick = () => {
            alert("DEBUG: clicked! //insert your custom logic here")
        }
    })

    setTimeout(() => {
        alert("User interaction timed out")
        sendToParent({type: "fail"})
    }, 15000)
}