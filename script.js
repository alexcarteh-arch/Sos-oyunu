// 1. SUPABASE BAĞLANTISI
const SUPABASE_URL = 'https://hspbpkziahstoaebagih.supabase.co';
const SUPABASE_KEY = 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'; // Paneldeki "anon" key ile değiştir!
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let myUser = localStorage.getItem('chat_username') || null;

// 2. UYGULAMAYI BAŞLAT
function startApp() {
    const input = document.getElementById('usernameInput');
    if (input.value.trim() === "") return alert("İsim yaz!");
    
    myUser = input.value.trim();
    localStorage.setItem('chat_username', myUser);
    
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    document.getElementById('myUsername').innerText = myUser;

    loadMessages(); // Eski mesajları getir
    listenRealtime(); // Canlı takibi aç
}

// Sayfa yenilendiğinde kullanıcı varsa direkt gir
if (myUser) {
    setTimeout(startApp, 100); 
}

// 3. MESAJ GÖNDER
async function sendMsg() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;

    const { error } = await supabaseClient
        .from('messages')
        .insert([{ sender: myUser, content: text }]);

    if (error) console.error("Hata:", error.message);
    input.value = "";
    if (navigator.vibrate) navigator.vibrate(20);
}

// 4. CANLI DİNLEME (REALTIME)
function listenRealtime() {
    supabaseClient
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            const msg = payload.new;
            addMsgToUI(msg.content, msg.sender);
        })
        .subscribe();
}

// 5. ESKİ MESAJLARI YÜKLE
async function loadMessages() {
    const { data } = await supabaseClient
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (data) {
        data.forEach(msg => addMsgToUI(msg.content, msg.sender));
    }
}

// 6. ARAYÜZE EKLE
function addMsgToUI(text, sender) {
    const box = document.getElementById('msgBox');
    const type = (sender === myUser) ? 'sent' : 'received';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const html = `
        <div class="bubble ${type}">
            <small style="display:block; font-size:0.6rem; opacity:0.5">${sender}</small>
            ${text}
            <small style="display:block; font-size:0.6rem; text-align:right; margin-top:4px">${time} ✓✓</small>
        </div>
    `;
    box.innerHTML += html;
    box.scrollTop = box.scrollHeight;
}

// Enter ile gönder
document.getElementById('msgInput')?.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMsg();
});
