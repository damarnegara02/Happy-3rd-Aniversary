let currentIdx = 0;
let pages = [];
let userSavedWish = ""; 

let gameScore = 0;
let heartY = -40;
let heartX = 120;
let gameInterval;

// MASUKKAN NOMOR TELEPONMU DI SINI (Tanpa spasi / tanda +)
const MY_WHATSAPP_NUMBER = "6282236397973"; 

window.addEventListener('DOMContentLoaded', () => {
    // Membuat elemen flash putih dinamis secara otomatis untuk efek kanta ledakan
    let flashDiv = document.createElement('div');
    flashDiv.id = "whiteFlash";
    document.body.appendChild(flashDiv);

    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 1000);
        }
    }, 1200);

    pages = [...document.querySelectorAll('.page')];
    startSakura();
    initAmbientSparkles();
    initTimelineScrollListener();
});

function openLetter() {
    document.getElementById('bgm').play().catch(() => {});
    setTimeout(nextPage, 500);
}

function nextPage() {
    if (currentIdx < pages.length - 1) {
        pages[currentIdx].classList.remove('active');
        currentIdx++;
        pages[currentIdx].classList.add('active');
        
        if(currentIdx === 1) {
            typeWriter("type1", "🌸 Kenapa Aku Sayang Kamu?", 0);
        }
        
        // **PERBAIKAN DITEKSI**: Menggunakan ID Objek halaman agar tidak terpengaruh penambahan page baru
        if(pages[currentIdx].id === "page6") {
            startTapGame();
        } else {
            clearInterval(gameInterval);
        }
    }
}

function typeWriter(elementId, text, i) {
    let el = document.getElementById(elementId);
    if (el && i < text.length) {
        el.innerHTML += text.charAt(i);
        setTimeout(() => typeWriter(elementId, text, i + 1), 60);
    }
}

function startSakura() {
    setInterval(() => {
        let container = document.getElementById('sakuraBg');
        if(!container) return;
        let sakura = document.createElement('div');
        sakura.className = 'sakura';
        sakura.innerHTML = Math.random() > 0.5 ? '🌸' : '💮';
        sakura.style.left = Math.random() * 100 + 'vw';
        sakura.style.animationDuration = Math.random() * 3 + 4 + 's';
        container.appendChild(sakura);
        setTimeout(() => sakura.remove(), 5500);
    }, 320);
}

function initAmbientSparkles() {
    const container = document.getElementById('ambientSparkles');
    if(!container) return;
    for (let i = 0; i < 20; i++) {
        let dot = document.createElement('div');
        dot.className = 'ambient-dot';
        dot.style.left = Math.random() * 100 + 'vw';
        dot.style.width = dot.style.height = (Math.random() * 6 + 4) + 'px';
        dot.style.animationDuration = (Math.random() * 3 + 3) + 's';
        dot.style.animationDelay = (Math.random() * 4) + 's';
        container.appendChild(dot);
    }
}

function initTimelineScrollListener() {
    const scrollArea = document.querySelector('.timeline-container-scroll');
    if(!scrollArea) return;
    scrollArea.addEventListener('scroll', () => {
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                node.classList.add('visible');
            }
        });
    });
    setTimeout(() => {
        const firstNode = document.querySelector('.timeline-node');
        if(firstNode) firstNode.classList.add('visible');
    }, 1200);
}

function flyUserWish() {
    const txtInput = document.getElementById('hugeWishInput');
    const wishText = txtInput.value.trim();
    if(wishText === "") {
        alert("Tuliskan dulu harapan terindahmu ya, Sayang... 💖");
        return;
    }
    userSavedWish = wishText; 
    txtInput.style.display = "none";
    document.getElementById('btnFlyWish').style.display = "none";
    
    for(let k = 0; k < 25; k++) {
        setTimeout(() => {
            let part = document.createElement('div');
            part.className = 'flying-wish-particle';
            part.innerText = wishText.length > 10 ? "✨ " + wishText.substring(0, 8) + "..." : "✨ " + wishText;
            part.style.setProperty('--start-x', (Math.random() * 80 + 10) + 'vw');
            part.style.setProperty('--end-x', (Math.random() * 80 + 10) + 'vw');
            part.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
            document.body.appendChild(part);
            setTimeout(() => part.remove(), 3000);
        }, k * 80);
    }
    setTimeout(() => {
        createStarBurst(window.innerWidth / 2, window.innerHeight * 0.3, 50);
        document.getElementById('wishStatusText').innerText = "✨ Harapanmu Berhasil Diterbangkan! ✨";
        document.getElementById('btnSkyNext').style.display = "inline-block";
        let waUrl = `https://api.whatsapp.com/send?phone=${MY_WHATSAPP_NUMBER}&text=Hai%20Sayang!%20Ini%20harapan%20yang%20aku%20tulis%20untuk%20kamu%3A%20%22${encodeURIComponent(wishText)}%22`;
        window.open(waUrl, '_blank');
    }, 2000);
}

function createStarBurst(cx, cy, count = 40) {
    const area = document.getElementById('starBurstContainer');
    if(!area) return;
    for(let i=0; i<count; i++) {
        let p = document.createElement('div');
        p.className = 'star-particle';
        p.innerHTML = ['⭐','✨','💖','🎉','🌈','❤️'][Math.floor(Math.random()*6)];
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 180 + 100;
        let mx = Math.cos(angle) * speed;
        let my = Math.sin(angle) * speed;
        p.style.setProperty('--mx', mx + 'px');
        p.style.setProperty('--my', my + 'px');
        area.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }
}

function startTapGame() {
    gameScore = 0;
    heartY = -40;
    // **PERBAIKAN 1**: Amankan posisi acak sumbu mendatar awal agar tidak kosong
    heartX = Math.floor(Math.random() * 180) + 20;
    
    document.getElementById('gameScore').innerText = "Skor: " + gameScore;
    const heartEl = document.getElementById('fallingHeart');
    
    // **PERBAIKAN 2**: Langsung aplikasikan koordinat posisi sebelum interval dimulai
    heartEl.style.left = heartX + 'px';
    heartEl.style.top = heartY + 'px';
    
    if(gameInterval) clearInterval(gameInterval);

    gameInterval = setInterval(() => {
        heartY += 6; 
        if(heartY > 230) {
            heartY = -40;
            heartX = Math.floor(Math.random() * 180) + 20;
            heartEl.style.left = heartX + 'px';
        }
        heartEl.style.top = heartY + 'px';
    }, 30);
}

function tapHeart(element) {
    gameScore++;
    document.getElementById('gameScore').innerText = "Skor: " + gameScore;
    
    // **PERBAIKAN 3**: Langsung memanggil variabel global heartX untuk memicu ledakan partikel yang akurat
    createStarBurst(heartX + 20, heartY + 20, 15);
    
    heartY = -40;
    heartX = Math.floor(Math.random() * 180) + 20;
    element.style.left = heartX + 'px';
    element.style.top = heartY + 'px';
    
    if(gameScore >= 5) {
        clearInterval(gameInterval); // Hentikan pergerakan jantung jika sudah menang
        let btn = document.getElementById('btnGameNext');
        if(btn) {
            btn.removeAttribute('disabled');
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    }
}

function mergeOurWishes() {
    document.getElementById('btnFinalProcess').style.display = "none";
    const mergeArea = document.getElementById('mergeArea');
    mergeArea.style.display = "flex";
    
    const sUser = document.getElementById('starUser');
    const sCreator = document.getElementById('starCreator');
    const wave = document.getElementById('sonicWave');
    const core = document.getElementById('glowCore');
    const flash = document.getElementById('whiteFlash');
    
    setTimeout(() => {
        sUser.style.left = "50%";
        sUser.style.transform = "translateX(-50%) scale(1.3) rotate(15deg)";
        sCreator.style.right = "50%";
        sCreator.style.transform = "translateX(50%) scale(1.3) rotate(-15deg)";
    }, 150);
    
    setTimeout(() => {
        flash.style.opacity = "1";
        document.body.classList.add('shake-active');
        wave.classList.add('wave-pulse');
        
        sCreator.style.display = "none";
        sUser.innerHTML = "<span style='font-size:55px; filter: drop-shadow(0 0 20px #fff);'>❤️</span><br><span style='color:#fffde7; font-size:14px; font-weight:bold; display:block; margin-top:10px; text-shadow:0 0 10px #ff477e;'>Takdir Kita Menyatu</span>";
        sUser.style.left = "50%";
        sUser.style.transform = "translate(-50%, -10px) scale(1.6)";

        core.style.opacity = "1";
        core.style.transform = "translate(-50%, -50%) scale(4.5)";

        setTimeout(() => {
            flash.style.opacity = "0";
        }, 150);

        for(let j = 0; j < 12; j++) {
            setTimeout(() => {
                let rx = (Math.random() * 80) - 40;
                let ry = (Math.random() * 80) - 40;
                createStarBurst((window.innerWidth / 2) + rx, (window.innerHeight * 0.72) + ry, 30);
            }, j * 100);
        }
    }, 2000); 
    
    setTimeout(() => {
        document.body.classList.remove('shake-active');
        core.style.transform = "translate(-50%, -50%) scale(0)";
        core.style.opacity = "0";
    }, 3200);

    setTimeout(() => {
        sUser.style.transition = "all 2.2s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
        sUser.style.transform = "translate(-50%, -100vh) scale(0.3)"; 
        sUser.style.opacity = "0";
        
        createStarBurst(window.innerWidth / 2, window.innerHeight * 0.25, 55);
    }, 4800);

    setTimeout(() => {
        celebrate();
    }, 6600);
}

function celebrate() {
    alert('💍 Dua bintang yang menyatu dan terbang ke atas melambangkan mimpi kita yang bersatu, dan semoga mimpi tersebut terwujudkan. Terima kasih sudah membaca surat ini Sayang, Love You ❤️');
    for (let i = 0; i < 110; i++) {
        setTimeout(() => {
            let conf = document.createElement('div');
            conf.className = 'heart-cursor';
            conf.innerHTML = ['❤️','✨','🌸','🎈','🎉','👑','⭐'][Math.floor(Math.random()*7)];
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.top = Math.random() * 100 + 'vh';
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 1800);
        }, i * 15);
    }
}

window.addEventListener('mousemove', (e) => {
    if(Math.random() > 0.88) {
        let heart = document.createElement('div');
        heart.className = 'heart-cursor';
        heart.innerHTML = '❤️';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }
});

function toggleMusic() {
    let bgm = document.getElementById('bgm');
    let ctrl = document.getElementById('musicControl');
    if(!bgm || !ctrl) return;
    if (bgm.paused) {
        bgm.play();
        ctrl.innerText = "🎵";
    } else {
        bgm.pause();
        ctrl.innerText = "🔇";
    }
}