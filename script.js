let currentChat = "";
let currentUser = null;

// 1. KAYIT VE GİRİŞ SİSTEMİ
function registerUser() {
    const user = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;
    if(user.length < 3 || pass.length < 5) {
        document.getElementById('authStatus').innerText = "HATA: Geçersiz kullanıcı adı veya şifre.";
        return;
    }
    // Veritabanına Kayıt Simülasyonu
    localStorage.setItem('neonChat_user_' + user, JSON.stringify({user, pass, profilePic: `https://i.pravatar.cc/150?u=${user}`}));
    document.getElementById('authStatus').innerText = "BAŞARILI! Giriş yapabilirsiniz.";
}

function loginUser() {
    const user = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;
    const savedData = JSON.parse(localStorage.getItem('neonChat_user_' + user));

    if(savedData && savedData.pass === pass) {
        currentUser = savedData;
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        initApp();
    } else {
        document.getElementById('authStatus').innerText = "HATA: Kullanıcı bulunamadı veya şifre yanlış.";
    }
}

// 2. ANA UYGULAMA MANTIĞI
function initApp() {
    // Profil resmini güncelle vb.
}

function openChat(name) {
    currentChat = name;
    document.getElementById('targetName').innerText = name;
    document.getElementById('chatWindow').classList.remove('hidden');
    
    // Mesajları şifreleme anahtarı simülasyonu (E2EE)
    sessionStorage.setItem('e2ee_key', Math.random().toString(36).substring(2));
}

function closeChat() {
    document.getElementById('chatWindow').classList.add('hidden');
}

// 3. MESAJLAŞMA VE OTOMATİK CEVAP (YAZIYOR...)
function sendMsg() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (text === "") return;

    // Şifreleme (Encryption) Simülasyonu
    const e2eeKey = sessionStorage.getItem('e2ee_key');
    const encryptedText = `[E2EE:${btoa(text)}:Key=${e2eeKey}]`;
    console.log("Şifrelenmiş Mesaj Veritabanına Gidiyor: " + encryptedText);

    addMsgToBox(text, 'sent');
    input.value = "";
    document.getElementById('msgInput').focus();

    if (navigator.vibrate) navigator.vibrate(20);

    // Karşı taraf "Yazıyor..." simülasyonu
    setTimeout(() => {
        document.getElementById('targetStatus').innerHTML = "<i>Yazıyor...</i>";
        setTimeout(() => {
            receiveMsg("Harika! Bu mesaj gerçek bir veritabanına bağlandığında diğer telefonlara da gidecek. 🚀");
            document.getElementById('targetStatus').innerText = "Çevrimiçi";
        }, 1500);
    }, 1000);
}

function addMsgToBox(text, type) {
    const msgBox = document.getElementById('msgBox');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgHtml = `
        <div class="bubble ${type}">
            ${text}
            <small style="display:block; font-size:0.7rem; text-align:right; margin-top:5px; color:#8696a0">${time} ✓✓</small>
        </div>
    `;
    msgBox.innerHTML += msgHtml;
    msgBox.scrollTop = msgBox.scrollHeight;
}

function receiveMsg(text) {
    addMsgToBox(text, 'received');
}

// 4. ARAMA SİSTEMİ (GÖRÜNTÜLÜ ARAMA ARAYÜZÜ)
function startCall(type) {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    document.getElementById('callWindow').classList.remove('hidden');
    // Burada WebRTC bağlantısı başlatılabilir
}

function endCall() {
    document.getElementById('callWindow').classList.add('hidden');
}

function showTyping() {
    // Burada veritabanına "yazıyor..." durumu gönderilir
}
