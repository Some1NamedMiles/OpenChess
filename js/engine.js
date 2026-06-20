// js/engine.js
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openingKey = urlParams.get('opening');
    const opening = openingsData[openingKey];
    
    if (!opening) {
        window.location.href = 'index.html';
        return;
    }

    // Core Chess Engine - Absolute clean state from move 1
    let game = new Chess(); 
    let board = null;

    // SORT THE LINES: e.g., Sort branches so lower difficulty numbers or types run first
    if (opening.branches && opening.branches.length > 1) {
        opening.branches.sort((a, b) => {
            // Priority ordering based on line types (e.g., Main lines first, then side lines)
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

    // Dynamic database lookup dictionary providing quick strategic reasonings for initial baseline setups
    const openingReasonings = {
        "e4": "Occupies the center, claims space, and immediately opens development pathways for the light-squared bishop and queen.",
        "d4": "Establishes a strong presence in the center while safely keeping the pawn protected by the queen.",
        "c5": "The Sicilian Defense. Fights for the d4 square using an asymmetrical flank pawn, aiming for complex counter-attacking chances.",
        "e5": "The most classical response, fighting back directly for equal space and control over the central squares.",
        "Nf3": "Develops a piece toward the center, prepares kingside castling, and attacks Black's vulnerable e5 square.",
        "Nc6": "Naturally develops a knight to defend the e5 square and contest the critical d4 break point.",
        "d6": "Solidifies the central structure, prevents further e5 expansions, and frees up light-squared bishop developmental diagonals.",
        "Nf6": "The Alekhine or Russian style defense, developing with a direct counter-attack against White's unprotected e4 target."
    };

    // 1. ASSEMBLE FULL SEQUENCE STARTING FROM MOVE 1
    opening.moves.forEach(moveStr => {
        const parts = moveStr.split(" ").slice(1);
        if (parts[0]) {
            const whyText = openingReasonings[parts[0]] || "Establishes fundamental strategic positioning, taking space and fighting for the center.";
            fullLessonSteps.push({ 
                notation: parts[0], 
                turn: 'w', 
                explanation: `Play the opening move ${parts[0]}. ${whyText}` 
            });
        }
        if (parts[1]) {
            const whyText = openingReasonings[parts[1]] || "Responds theoretically to contest control over key breakthrough squares.";
            fullLessonSteps.push({ 
                notation: parts[1], 
                turn: 'b', 
                explanation: `Play ${parts[1]}. ${whyText}` 
            });
        }
    });

    // Append specific branch continuation steps
    activeBranch.steps.forEach(step => {
        let side = step.move.startsWith("White") ? 'w' : 'b';
        // Strips any potential asterisks hiding inside the data file string feeds
        let cleanExplanation = step.explanation.replace(/\*\*/g, '');
        fullLessonSteps.push({
            notation: step.notation,
            turn: side,
            explanation: cleanExplanation
        });
    });

    // 2. TURN SELECTION AND DRAG FILTERS
    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;

        const currentTask = fullLessonSteps[currentStepIndex];
        if (!currentTask) return false;

        // Block dragging opponent color pieces during the player's active turn assignments
        if (currentTask.turn === 'w' && piece.search(/^b/) !== -1) return false;
        if (currentTask.turn === 'b' && piece.search(/^w/) !== -1) return false;
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

        // Check verification string tags
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

        // Trigger automatic progression handling loop
        processNextSequenceStep();
    }

    // 3. THE OPPOSITE COLOR PLAYS AUTOMATICALLY FLOW
    function processNextSequenceStep() {
        if (currentStepIndex >= fullLessonSteps.length) {
            triggerCourseLineCleared();
            return;
        }

        const nextTask = fullLessonSteps[currentStepIndex];
        coachSpeechBubbleBubble.innerHTML = nextTask.explanation;

        // Automatically fire the move if it belongs to the opposite side
        // Example: If the user just played White ('w'), the script auto-executes the upcoming Black ('b') move
        if ((nextTask.turn === 'b' && game.turn() === 'b') || (nextTask.turn === 'w' && game.turn() === 'w')) {
            setTimeout(() => {
                let autoMove = game.move(nextTask.notation);
                board.position(game.fen());
                
                clearSquareHighlights();
                if (autoMove) highlightBoardSquares(autoMove.from, autoMove.to);

                currentStepIndex++;
                updateProgressIndicatorBar();

                // Recursively check to see if there are more consecutive opponent replies or if control shifts back to user
                processNextSequenceStep();
            }, 750);
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    // Initialize board layout from scratch setup
    board = Chessboard('chessrepsBoard', {
        position: 'start',
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    // Set first prompt display on script startup execution loops
    if (fullLessonSteps[currentStepIndex]) {
        coachSpeechBubbleBubble.innerHTML = fullLessonSteps[currentStepIndex].explanation;
        // Handle edge case if first layout instruction begins on an automated sequence step
        processNextSequenceStep();
    }
    updateProgressIndicatorBar();

    // Visual highlights helper parameters
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
        coachSpeechBubbleBubble.innerHTML = "🎉 Line Discovered! You've played through the entire sequence step-by-step from the starting position and locked it into memory.";
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
