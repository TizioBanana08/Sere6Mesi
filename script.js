// 1. GESTIONE PASSWORD
const CORRECT_PASSWORD = "DODO"; // <-- Cambia qui la password segreta!

function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        startCounters();
        initMemoryGame(); // Prepara il gioco del memory
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// 2. CONTATORI
function startCounters() {
    // Data del fidanzamento (Formato: AAAA-MM-GG)
    const startDate = new Date("2026-01-25"); 
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-count').innerText = diffDays;

    // Contatori "infiniti" che salgono ogni tot secondi
    setInterval(() => {
        let kisses = document.getElementById('kisses-count');
        kisses.innerText = parseInt(kisses.innerText) + 1;
    }, 1);

    setInterval(() => {
        let dates = document.getElementById('dates-count');
        dates.innerText = parseInt(dates.innerText) + 1;
    }, 50);
}

// 3. LOGICA MEMORY GAME
const fotoUniche = [
    'img/baby.jpg',
    'img/girasole.jpg',
    'img/spidy.jpg',
    'img/sushi.jpeg'
];
let selectedCards = [];
let matchedPairs = 0;

let listaImmaginiSplit = [...fotoUniche, ...fotoUniche];


function initMemoryGame() {
    const board = document.getElementById('memory-board');
    if (!board) return;
    
    // Mescoliamo le carte
    let shuffled = listaImmaginiSplit.sort(() => 0.5 - Math.random());
    board.innerHTML = '';

    // Creiamo l'HTML per ogni carta
    shuffled.forEach((percorsoImmagine) => {
        let card = document.createElement('div');
        card.classList.add('card');
        // Salviamo il percorso dell'immagine nel dataset per il controllo della corrispondenza
        card.dataset.img = percorsoImmagine; 
        card.innerText = '❓'; // Testo mostrato quando la carta è coperta
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    // Seleziona la carta solo se ne abbiamo meno di 2 girate e non è già girata o accoppiata
    if (selectedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        
        card.classList.add('flipped');
        // Creiamo dinamicamente il tag immagine e lo inseriamo nella carta
        card.innerHTML = `<img src="${card.dataset.img}" alt="foto memory">`;
        
        selectedCards.push(card);

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 800); // Aspetta un po' prima di controllare
        }
    }
}

function checkMatch() {
    const card1 = selectedCards[0];
    const card2 = selectedCards[1];

    // Controlliamo se i percorsi delle immagini memorizzati nel dataset sono uguali
    if (card1.dataset.img === card2.dataset.img) {
        // CORRISPONDENZA TROVATA!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === fotoUniche.length) {
            // VITTORIA! Mostra la lettera segreta
            setTimeout(() => {
                document.getElementById('letter-modal').style.display = 'block';
            }, 500);
        }
    } else {
        // NESSUNA CORRISPONDENZA, ricopriamo le carte
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.innerHTML = '❓'; // Torna al punto di domanda
            
            card2.classList.remove('flipped');
            card2.innerHTML = '❓';
        }, 200); // Piccolo ritardo extra per far vedere la seconda foto
    }
    // Resettiamo l'array delle carte selezionate per il prossimo turno
    selectedCards = [];
}

function closeModal() {
    document.getElementById('letter-modal').style.display = 'none';
}