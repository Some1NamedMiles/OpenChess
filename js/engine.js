// js/engine.js
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openingKey = urlParams.get('opening');
    const opening = openingsData[openingKey];
    
    if (!opening) {
        window.location.href = 'index.html';
        return;
    }

    // Clean engine state from move 1
    let game = new Chess(); 
    let board = null;

    // Sort lines by difficulty criteria (Main Lines first)
    if (opening.branches && opening.branches.length > 1) {
        opening.branches.sort((a, b) => {
            const weight = { "Main Line": 1, "Side Line": 2, "Gambit": 3 };
            return (weight[a.type] || 9) - (weight[b.type] || 9);
        });
    }

    let activeBranch = opening.branches[0]; 
    let currentStepIndex = 0;
    let fullLessonSteps = [];

    // UI View Elements
    const courseSubTitleHeader = document.getElementById("courseSubTitleHeader");
    const coachSpeechBubbleBubble = document.getElementById("coachSpeechBubbleBubble");
    const learningProgressBarFill = document.getElementById("learningProgressBarFill");
    const navQuitBtn = document.getElementById("navQuitBtn");
    const hintActionBtn = document.getElementById("hintActionBtn");

    courseSubTitleHeader.textContent = `${opening.name} - ${activeBranch.title}`;

    const openingReasonings = {
        "e4": "Occupies the center, claims space, and opens pathways for your pieces.",
        "d4": "Establishes a strong presence in the center under direct protection.",
        "c5": "The Sicilian Defense. Fights for the center using an asymmetrical flank pawn.",
        "e5": "The classical response, fighting back directly for equal space.",
        "Nf3": "Develops a piece toward the center and targets the e5 square.",
        "Bf4": "The London System. Develops the dark-squared bishop outside the pawn chain early.",
        "Bc4": "The Italian Game. Targets Black's weak f7 square right out of the gate.",
        "Nc6": "Naturally develops a knight to defend the center squares.",
        "Nf6": "Develops with a direct counter-attack against White's unprotected e4 pawn."
    };

    // 1. BUILD THE CHRONOLOGICAL TASK SEQUENCE
    opening.moves.forEach(moveStr => {
        const parts = moveStr.split(" ").slice(1);
        if (parts[0]) {
            const whyText = openingReasonings[parts[0]] || "Establishes structural positioning, taking space and fighting for the center.";
            fullLessonSteps.push({ notation: parts[0], turn: 'w', explanation: `Play the opening move ${parts[0]}. ${whyText}` });
        }
        if (parts[1]) {
            const whyText = openingReasonings[parts[1]] || "Responds theoretically to contest control over key breakthrough squares.";
            fullLessonSteps.push({ notation: parts[1], turn: 'b', explanation: `Play ${parts[1]}. ${whyText}` });
        }
    });

    // Append specific branch continuation steps
    activeBranch.steps.forEach(step => {
        let side = step.move.startsWith("White") ? 'w' : 'b';
        let cleanExplanation = step.explanation.replace(/\*\*/g, '');
        fullLessonSteps.push({
            notation: step.notation,
            turn: side,
            explanation: cleanExplanation
        });
    });

    // 2. DYNAMICALLY DETECT USER COLOR AS ASSIGNED IN CHESSREPS
    // In Chessreps, your color matches whoever makes the very first move of the whole course.
    let primaryUserTurn = 'w';
    if (fullLessonSteps.length > 0) {
        primaryUserTurn = fullLessonSteps[0].turn;
    }

    // Enforce Turn Selection Restrictions
    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;

        const currentTask = fullLessonSteps[currentStepIndex];
        if (!currentTask) return false;

        // Block pulling pieces if it is the other side's turn
        if (currentTask.turn === 'w' && piece.search(/^b/) !== -1) return false;
        if (currentTask.turn === 'b' && piece.search(/^w/) !== -1) return false;

        // Ensure you only touch your assigned color
        if (currentTask.turn !== primaryUserTurn) return false;
    }

    function onDrop(source, target) {
        const currentTask = fullLessonSteps[currentStepIndex];
        if (!currentTask) return 'snapback';

        let moveAttempt = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (moveAttempt === null) return 'snapback';

        // Validation Check
        if (moveAttempt.san !== currentTask.notation) {
            game.undo();
            coachSpeechBubbleBubble.textContent = `Incorrect move. Follow the guide line and try playing: ${currentTask.notation}`;
            return 'snapback';
        }

        // Correct user move!
        clearSquareHighlights();
        highlightBoardSquares(source, target);
        
        currentStepIndex++;
        updateProgressIndicatorBar();

        // Pass control to look for the next move segment
        processNextSequenceStep();
    }

    // 3. SECURE INTERACTIVE OPPOSITE SIDE AUTO-PLAY
    function processNextSequenceStep() {
        if (currentStepIndex >= fullLessonSteps.length) {
            triggerCourseLineCleared();
            return;
        }

        const nextTask = fullLessonSteps[currentStepIndex];
        coachSpeechBubbleBubble.innerHTML = nextTask.explanation;

        // Auto-play ONLY if it's the opponent's turn
        if (nextTask.turn !== primaryUserTurn) {
            setTimeout(() => {
                let autoMove = game.move(nextTask.notation);
                board.position(game.fen());
                
                clearSquareHighlights();
                if (autoMove) highlightBoardSquares(autoMove.from, autoMove.to);

                currentStepIndex++;
                updateProgressIndicatorBar();

                // Check again for the next sequence step
                processNextSequenceStep();
            }, 800);
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    // 4. MOUNT AND AUTO-FLIP PERSPECTIVE BASED ON DETECTED ASSIGNMENT
    board = Chessboard('chessrepsBoard', {
        position: 'start',
        draggable: true,
        orientation: primaryUserTurn === 'w' ? 'white' : 'black', // White for London/Italian, Black for Sicilian response
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    // Fire startup sequence execution hooks
    if (fullLessonSteps[currentStepIndex]) {
        coachSpeechBubbleBubble.innerHTML = fullLessonSteps[currentStepIndex].explanation;
        processNextSequenceStep();
    }
    updateProgressIndicatorBar();

    // UI Utilities
    function highlightBoardSquares(fromSquare, toSquare) {
        $('#chessrepsBoard .square-' + fromSquare).addClass('highlight-yellow');
        $('#chessrepsBoard .square-' + toSquare).addClass('highlight-yellow');
    }

    function clearSquareHighlights() {
        $('#chessrepsBoard div').removeClass('highlight-yellow');
    }

    function updateProgressIndicatorBar() {
        if (fullLessonSteps.length === 0) return;
        let percentage = (currentStepIndex / fullLessonSteps.length) * 100;
        learningProgressBarFill.style.width = `${percentage}%`;
    }

    function triggerCourseLineCleared() {
        coachSpeechBubbleBubble.innerHTML = "🎉 Line Discovered! You've successfully completed this chess theory branch variation segment!";
    }

    hintActionBtn.addEventListener("click", () => {
        if (fullLessonSteps[currentStepIndex]) {
            alert(`Hint: Play "${fullLessonSteps[currentStepIndex].notation}"`);
        }
    });

    navQuitBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    window.addEventListener('resize', () => {
        if (board) board.resize();
    });
});
