let setEmoji = ""

EMOJIS = [
    ["Artemis Mission","🚀"],
    ["Healthy Recipes","🥗"],
    ["Music","🎶"],
    ["Films","🎬"],
    ["Pandas","🐼"],
    ["Football","⚽"],
    ["Traveling","✈️"],
    ["Videogaming","🎮"],
    ["Photography","📸"],
    ["Rose gardening","🌹"],
    ["Dog Kissing","🐶"],
    ["Bread Baking","🍞"],
    ["Cooking beans","🫘"],
    ["Crow watching","🐦‍⬛"],
    ["Sunflower farming","🌻"],
    ["Cherry Blossom Festival","🌸"],
    ["Hibiscus Tea","🌺"]
]

function showEmojiPicker(){
    document.getElementById('bot-message-overlay').style.display='none'

    let emojis = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, 5);

    for (let i = 0; i<5;i++) {
        let button = document.getElementById(`emoji-button-${i+1}`)
        button.innerText = emojis[i][0] + emojis[i][1]
        button.onclick = ()=>{
            document.getElementById('interest-picker-overlay').style.display='none'
            document.getElementById('emoji-container-1').style.display='flex'
            let animate = spawnEmojiOverlay(emojis[i][1])
            setEmoji=emojis[i][1]
            generateVideoAd(animate)
        }
    }

    document.getElementById('interest-picker-overlay').style.display='flex'
}

function hideEmojiOverlay(){
    let container = document.getElementById('emoji-container-1')
    if(container) container.style.display='none'
    container =  document.getElementById('emoji-container-2')
    if(container) container.style.display='none'
}

function showBiggerEmojiOverlay() {
    document.getElementById('bot-message-overlay').style.display='none'

    document.getElementById(`emoji-container-1`).remove()
    document.getElementById(`emoji-container-2`).style.display='flex'
    let animateEmojis = spawnEmojiOverlay(setEmoji,2)

    generateVideoAd(animateEmojis)
}

function spawnEmojiOverlay(emoji,iteration=1){
    const container = document.getElementById(`emoji-container-${iteration}`)
    const N = 15*iteration;

    const items = []

    for (let i = 0; i < N; i++) {
        const el = document.createElement('div')
        el.className = `emoji-${iteration}`
        el.textContent = emoji

        const x = Math.random() * (window.innerWidth - 30)
        const y = Math.random() * (window.innerHeight - 30)

        const vx = (6 - (Math.random() * 12)) || -1
        const vy = (6 - (Math.random() * 12)) || 1

        items.push({ el, x, y, vx, vy })

        el.style.left = x + 'px'
        el.style.top = y + 'px'

        container.appendChild(el)
    }

    function animate() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        for (const item of items) {
            item.x += item.vx
            item.y += item.vy

            if (item.x <= 0 || item.x >= width - 30) item.vx *= -1
            if (item.y <= 0 || item.y >= height - 30) item.vy *= -1

            item.el.style.left = item.x + 'px'
            item.el.style.top = item.y + 'px'
        }

        requestAnimationFrame(animate)
    }

    return animate
}
