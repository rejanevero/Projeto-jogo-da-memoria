// memory_script.js

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('memory-board');
    const movesCountElement = document.getElementById('moves-count');
    const pairsFoundElement = document.getElementById('pairs-found');
    const timerElement = document.getElementById('timer'); // Para o timer opcional
    const winMessageElement = document.getElementById('win-message');
    const restartBtn = document.getElementById('restart-game-btn');

    // Símbolos/Imagens para as cartas - use pares!
    // Exemplo com ícones Font Awesome (certifique-se de ter Font Awesome linkado no HTML)
    const cardSymbols = [
        'fas fa-heart', 'fas fa-star', 'fas fa-bolt', 'fas fa-cloud',
        'fas fa-anchor', 'fas fa-car', 'fas fa-bicycle', 'fas fa-camera'
    ];
    let gameCards = []; // Array que conterá os objetos das cartas duplicadas e embaralhadas

    let flippedCards = []; // Armazena as duas cartas viradas atualmente
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true; // Para evitar cliques rápidos enquanto as cartas estão virando

    // Timer (opcional)
    let timerInterval;
    let secondsElapsed = 0;

    // Configurações do Tabuleiro (Ex: 4x4 = 16 cartas, 8 pares)
    const PAIRS_TO_MATCH = cardSymbols.length; // Baseado nos símbolos únicos
    const TOTAL_CARDS = PAIRS_TO_MATCH * 2;
    
    // Determina colunas do grid - pode ajustar para layouts diferentes
    // Ex: 4 colunas para 16 cartas, 5 colunas para 20, 6 para 24
    let gridColumns = 4; 
    if (TOTAL_CARDS === 20) gridColumns = 5;
    if (TOTAL_CARDS >= 24) gridColumns = 6;
    board.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;


    function createCard(symbol) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        cardContainer.dataset.symbol = symbol; // Guarda o símbolo para comparação

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const icon = document.createElement('i');
        icon.className = symbol; // Ex: 'fas fa-heart'
        cardFront.appendChild(icon);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const backIcon = document.createElement('i');
        backIcon.className = 'fas fa-question'; // Ícone para o verso da carta
        cardBack.appendChild(backIcon);
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardContainer.appendChild(cardInner);

        cardContainer.addEventListener('click', () => flipCard(cardContainer));
        return cardContainer;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Troca elementos
        }
        return array;
    }

    function initializeBoard() {
        // Resetar variáveis do jogo
        matchedPairs = 0;
        moves = 0;
        flippedCards = [];
        gameCards = [];
        canFlip = true;
        board.innerHTML = ''; // Limpa tabuleiro anterior
        winMessageElement.style.display = 'none';
        updateGameInfo();
        resetTimer(); // Se estiver usando timer

        // Duplica os símbolos para criar os pares
        const duplicatedSymbols = [...cardSymbols, ...cardSymbols];
        const shuffledSymbols = shuffleArray(duplicatedSymbols);

        shuffledSymbols.forEach(symbol => {
            const card = createCard(symbol);
            gameCards.push(card); // Adiciona ao array para referência, se necessário
            board.appendChild(card);
        });
        startTimer(); // Se estiver usando timer
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return; // Não faz nada se não puder virar, já estiver virada ou for um par
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false; // Impede virar mais cartas enquanto verifica
            moves++;
            updateGameInfo();
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // É um par!
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateGameInfo();
            flippedCards = []; // Reseta as cartas viradas
            canFlip = true; // Permite virar novas cartas
            checkWinCondition();
        } else {
            // Não é um par, vira de volta após um tempo
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000); // Tempo para ver as cartas (1 segundo)
        }
    }

    function checkWinCondition() {
        if (matchedPairs === PAIRS_TO_MATCH) {
            stopTimer(); // Se estiver usando timer
            setTimeout(() => { // Pequeno delay para a última animação de match terminar
                winMessageElement.textContent = `Parabéns! Você encontrou todos os ${PAIRS_TO_MATCH} pares em ${moves} movimentos e ${formatTime(secondsElapsed)}!`;
                winMessageElement.style.display = 'block';
            }, 600); // Ajuste se o tempo da animação de "match" for diferente
        }
    }

    function updateGameInfo() {
        movesCountElement.textContent = `Movimentos: ${moves}`;
        pairsFoundElement.textContent = `Pares Encontrados: ${matchedPairs}/${PAIRS_TO_MATCH}`;
    }
    
    // --- Funções do Timer (Opcional) ---
    function startTimer() {
        stopTimer(); // Limpa qualquer timer anterior
        secondsElapsed = 0;
        timerElement.textContent = `Tempo: ${formatTime(secondsElapsed)}`;
        timerInterval = setInterval(() => {
            secondsElapsed++;
            timerElement.textContent = `Tempo: ${formatTime(secondsElapsed)}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }
    
    function resetTimer() {
        stopTimer();
        secondsElapsed = 0;
        timerElement.textContent = `Tempo: 0s`;
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
    }
    // --- Fim Funções do Timer ---


    restartBtn.addEventListener('click', initializeBoard);

    // Inicia o jogo
    initializeBoard();
});