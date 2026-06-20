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

    let activeBranch = opening.branches[0]; 
    let currentStepIndex = 0;
    
    // This master array will hold every single move in chronological order
    let fullLessonSteps = [];

    // View Elements
    const courseSubTitleHeader = document.getElementById("courseSubTitleHeader");
    const coachSpeechBubbleBubble = document.getElementById("coachSpeechBubbleBubble");
    const learningProgressBarFill = document.getElementById("learningProgressBarFill");
    const navQuitBtn = document.getElementById("navQuitBtn");
    const hintActionBtn = document.getElementById("hintActionBtn");

    courseSubTitleHeader.textContent = `${opening.name} - ${activeBranch.title}`;

    // 1. BUILD THE COMPLETE CHRONOLOGICAL PATH FROM MOVE 1
    // Parse the baseline introductory moves first
    opening.moves.forEach(moveStr => {
        const parts = moveStr.split(" ").slice(1);
        if (parts[0]) {
            fullLessonSteps.push({ 
                notation: parts[0], 
                turn: 'w', 
                explanation: `Let's start learning this line. Play the opening move: **${parts[0]}**.` 
            });
        }
        if (parts[1]) {
            fullLessonSteps.push({ 
                notation: parts[1], 
                turn: 'b', 
                explanation: `Now react with Black's standard theoretical baseline reply: **${parts[1]}**.` 
            });
        }
    });

    // Append the specific branch variations right after the baseline intro
    activeBranch.steps.forEach(step => {
        let side = step.move.startsWith("White") ? 'w' : 'b';
        fullLessonSteps.push({
            notation: step.notation,
            turn: side,
            explanation: step.explanation
        });
    });

    // 2. INTERACTION RULES (No computer auto-play; player plays EVERYTHING to memorize)
    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;

        const currentTask = fullLessonSteps[currentStepIndex];
        if (!currentTask) return false;

        // Block dragging the wrong color piece on a designated turn
        if (currentTask.turn === 'w' && piece.search(/^b/) !== -1) return false;
        if (currentTask.turn === 'b' && piece.search(/^w/) !== -1) return false;
    }

    function onDrop(source, target) {
        const currentTask = fullLessonSteps[currentStepIndex];
        if (!currentTask) return 'snapback';

        // Test legality
        let moveAttempt = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (moveAttempt === null) return 'snapback';

        // Verify if it matches the text instructions
        if (moveAttempt.san !== currentTask.notation) {
            game.undo(); // Revert logic model state
            coachSpeechBubbleBubble.textContent = `❌ That's not the target move for this sequence. Follow the guide and try playing: ${currentTask.notation}`;
            return 'snapback';
        }

        // Correct move made!
        clearSquareHighlights();
        highlightBoardSquares(source, target);
        
        // Advance to the next instruction step immediately
        currentStepIndex++;
        updateProgressIndicatorBar();

        // Check if there are more moves left to memorize
        if (currentStepIndex < fullLessonSteps.length) {
            const nextTask = fullLessonSteps[currentStepIndex];
            coachSpeechBubbleBubble.innerHTML = nextTask.explanation;
        } else {
            triggerCourseLineCleared();
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    // 3. INITIALIZE BOARD AT THE ABSOLUTE STARTING SETUP
    board = Chessboard('chessrepsBoard', {
        position: 'start', // Standard 8x8 setup from scratch
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    // Display the first move instructions on launch
    if (fullLessonSteps[currentStepIndex]) {
        coachSpeechBubbleBubble.innerHTML = fullLessonSteps[currentStepIndex].explanation;
    }
    updateProgressIndicatorBar();

    // Helper functions for UI response states
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
        coachSpeechBubbleBubble.innerHTML = "🎉 <strong>Line Discovered!</strong> You've played through the entire sequence step-by-step from the starting position and locked it into memory.";
    }

    hintActionBtn.addEventListener("click", () => {
        if (fullLessonSteps[currentStepIndex]) {
            alert(`Hint: You need to play "${fullLessonSteps[currentStepIndex].notation}"`);
        }
    });

    navQuitBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    window.addEventListener('resize', () => {
        if (board) board.resize();
    });
});
