const PASSWORD = "1442010";
const AUDIO = {
    bg: new Audio('bg.mp3'),
    camera: new Audio('camera.mp3'),
    low: ['low1.mp3', 'low2.mp3', 'low3.mp3', 'low4.mp3'],
    high: ['high1.mp3', 'high2.mp3', 'high3.mp3']
};
AUDIO.bg.loop = true;
AUDIO.bg.volume = 0.8; // صوت الخلفية عالي

let audioStarted = false;
let inputPassword = "";

/* --- السيناريو والرسايل --- */
const storyData = [
    { text: "ازيك يا رخمه اقصد رحمه 😅 انت عارفه انت بتوحشيني اوي والمره دي طولتي في الغياب وقلقتيني عليكي اوي بس قولت اعملك حاجه تفرحك لما ترجعي عشان عارف انك بتزعلي اوي لما انت بتغيبي عشان بيكون غصب عنك بس بحبببببببك وصدقيني لوفضلت اعبر عن حبي ليكي بجد وان شاء الله المره دي تكوني بخير عشان انا قلقان اوي", image: null, caption: null, action: "normal" },
    { text: "إيه ده الحقي! ده في حاجة على وشك... 👀", image: null, caption: null, action: "normal" },
    { text: "هممممم قربي كده عشان اصورها واورهالك", image: "donkey.jpg", caption: "هههههههه لا مؤاخذة أنا كنت بصور حمار 😂", action: "camera" },
    { text: "سوري سوري يا حبيبتي 😅 ارجعي إنتي بس سنة ورا", image: null, caption: null, action: "normal" },
    { text: "خلاص كده تمام... استني بصي هنا 📸", image: "moon.jpg", caption: "أي القمر ده يا ناس ده ربنا بيحبني بقي 🌕❤️", action: "camera" },
    { text: "عشان أقولك آخر حاجة... لازم تلحقي القلب ده الأول 💖", image: null, caption: null, action: "game" },
    { text: "بصي يا رحمتي مهما يحصل صدقيني مش هحب غيرك في حياتي كلها انت احلي حاجه حصلتلي بجد من ببقي مش قادر علي فراقك لو دقيقه واحد بس عارف انه غصب عنك وانت بتكوني متضايقه وزعلانه زي بالظبط ربنا يخلنا لبعض يا عمري وامتي بجد ان احنا نفضل مع بعض طول العمر + انا كنت بعملك المفجاءه دي قبل ما انت تيجي عشان تكون جاهزه مفجاءه صادمه ليك اول لما تفتحي علي طول بس انتي بعتيلي امبارح وانت الي فجاتيني 😅😅 اسف عشان مقولتكيش بس كنت عاوز اخليها مفجاءه حلوه لعمري يا عمري🌚", image: null, caption: null, action: "last" }
];

let currentStoryIndex = 0;
const dotsContainer = document.getElementById('dots');
for (let i = 0; i < PASSWORD.length; i++) { let dot = document.createElement('div'); dot.className = 'dot'; dotsContainer.appendChild(dot); }
const dots = document.querySelectorAll('.dot');
const cameraAnim = document.createElement('div'); cameraAnim.className = 'camera-anim'; cameraAnim.textContent = '📸'; document.body.appendChild(cameraAnim);

function startBackgroundMusic() { if (!audioStarted) { AUDIO.bg.play().catch(e => console.log("محتاج تفاعل")); audioStarted = true; } }
document.getElementById('musicBtn').addEventListener('click', function() { if (AUDIO.bg.paused) { AUDIO.bg.play(); this.classList.remove('muted'); } else { AUDIO.bg.pause(); this.classList.add('muted'); } });

// شاشة القفل
function updateDots() { dots.forEach((dot, i) => { dot.classList.toggle('filled', i < inputPassword.length); }); }
document.getElementById('keypad').addEventListener('click', (e) => {
    const btn = e.target.closest('.key'); if (!btn) return;
    startBackgroundMusic();
    const val = btn.dataset.num;
    if (val === 'del') inputPassword = inputPassword.slice(0, -1);
    else if (val === 'clear') inputPassword = "";
    else if (inputPassword.length < PASSWORD.length) inputPassword += val;
    updateDots();
    if (inputPassword.length === PASSWORD.length) {
        setTimeout(() => {
            if (inputPassword === PASSWORD) switchScreen('lock', 'loveMeter');
            else {
                const lockScreen = document.getElementById('lockScreen');
                lockScreen.classList.add('shake');
                document.getElementById('errorMsg').textContent = "غلط يا حبيبتي 😜 جربي تاني";
                setTimeout(() => { lockScreen.classList.remove('shake'); inputPassword = ""; updateDots(); document.getElementById('errorMsg').textContent = ""; }, 800);
            }
        }, 300);
    }
});

function switchScreen(from, to) {
    document.getElementById(from + 'Screen').classList.remove('active');
    document.getElementById(to + 'Screen').classList.add('active');
}

// السلايدر
const slider = document.getElementById('loveSlider');
const confirmBtn = document.getElementById('confirmLove');
let sliderTimeout;
slider.addEventListener('input', function() {
    const val = parseInt(this.value);
    document.getElementById('loveValue').textContent = val;
    clearTimeout(sliderTimeout);
    sliderTimeout = setTimeout(() => {
        if (val < 50) { playRandomSound(AUDIO.low); document.getElementById('meterMessage').textContent = "إيه ده يا بت؟! إنتي بتهزري؟ 😠😠"; confirmBtn.disabled = true; }
        else if (val > 70) { playRandomSound(AUDIO.high); document.getElementById('meterMessage').textContent = "أهو ده الكلام! خراب علي الكل 🔥🔥"; if (val === 100) confirmBtn.disabled = false; }
        else { document.getElementById('meterMessage').textContent = "همممم شكلك مش مركزة، زوديها بقى 👀"; confirmBtn.disabled = true; }
    }, 300);
});
function playRandomSound(arr) { const audio = new Audio(arr[Math.floor(Math.random() * arr.length)]); audio.play().catch(e => console.log("تفاعل")); }
confirmBtn.addEventListener('click', () => { switchScreen('loveMeter', 'story'); loadStory(0); });

// السيناريو
const messageText = document.getElementById('messageText');
const storyImage = document.getElementById('storyImage');
const imageCaption = document.getElementById('imageCaption');
const nextBtn = document.getElementById('nextBtn');
const gameBtn = document.getElementById('gameBtn');

let dodgeCount = 0; // متغير عشان نحسب مرات الهروب

function loadStory(index) {
    const data = storyData[index];
    storyImage.style.display = 'none'; imageCaption.style.display = 'none';
    nextBtn.style.display = 'none'; gameBtn.style.display = 'none';
    messageText.style.opacity = 0;
    
    setTimeout(() => {
        messageText.textContent = data.text; messageText.style.opacity = 1;
        
        if (data.action === "camera") {
            setTimeout(() => { // 3 ثواني تأخير
                cameraAnim.style.display = 'block';
                AUDIO.camera.play().catch(e => console.log("صوت الكاميرا"));
                setTimeout(() => {
                    cameraAnim.style.display = 'none';
                    if (data.image) { storyImage.src = data.image; storyImage.style.display = 'block'; }
                    if (data.caption) { imageCaption.textContent = data.caption; imageCaption.style.display = 'block'; }
                    nextBtn.style.display = "inline-block";
                }, 800);
            }, 3000);
        } 
        else if (data.action === "game") {
            gameBtn.style.display = "block";
            gameBtn.style.top = "50%"; gameBtn.style.left = "50%";
            dodgeCount = 0; // تصفير العداد في كل مرة
            
            // يشتغل بالماوس (للكمبيوتر)
            gameBtn.onmouseover = function() { 
                if (dodgeCount < 3) {
                    this.style.top = (Math.random() * 60 + 20) + "%";
                    this.style.left = (Math.random() * 60 + 20) + "%";
                    dodgeCount++;
                }
            };
            
            // يشتغل باللمس (للتلفون)
            gameBtn.onclick = function(e) {
                e.preventDefault(); // عشان يمنع تكرار الحدث
                if (dodgeCount < 3) {
                    this.style.top = (Math.random() * 60 + 20) + "%";
                    this.style.left = (Math.random() * 60 + 20) + "%";
                    dodgeCount++;
                } else {
                    gameBtn.style.display = 'none'; 
                    currentStoryIndex++; 
                    loadStory(currentStoryIndex);
                }
            };
        }
        else {
            if (data.image) { storyImage.src = data.image; storyImage.style.display = 'block'; }
            if (data.caption) { imageCaption.textContent = data.caption; imageCaption.style.display = 'block'; }
            nextBtn.style.display = "inline-block";
        }
    }, 300);

    if (data.action === "last") {
        nextBtn.textContent = "خلصت المفاجأة ❤️";
        nextBtn.onclick = () => { nextBtn.style.display = "none"; alert("بحبك يا رحمتي ❤️"); };
    } else if (data.action !== "game") {
        nextBtn.textContent = "التالي 💌";
        nextBtn.onclick = () => { currentStoryIndex++; if (currentStoryIndex < storyData.length) loadStory(currentStoryIndex); };
    }
}

// قلوب متساقطة
setInterval(() => {
    if (!document.getElementById('lockScreen').classList.contains('active')) {
        const heart = document.createElement('div'); heart.className = 'heart-fall';
        heart.textContent = ["❤️", "💕", "💖", "💗", "💓", "💞"][Math.floor(Math.random() * 6)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (Math.random() * 3 + 4) + "s";
        document.getElementById('hearts-container').appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }
}, 400);