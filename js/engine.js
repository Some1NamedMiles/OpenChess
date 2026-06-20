// js/engine.js
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openingKey = urlParams.get('opening');
    const opening = openingsData[openingKey];
    
    if (!opening) {
        window.location.href = 'index.html';
        return;
    }

    // Interactive Engine Instances
    let game = new Chess();
    let board = null;

    // Active Study State variables
    let activeBranch = null;
    let currentStepIndex = 0;
    let baseMovesCount = 0;
    let cleanBaseMoves = [];

    // Elements
    const titleEl = document.getElementById("openingTitle");
    const coachInstructionEl = document.getElementById("coachInstruction");
    const movesTrackerEl = document.getElementById("movesTracker");
    const branchesContainerEl = document.getElementById("branchesContainer");
    const coachBoxEl = document.getElementById("coachBox");
    const coachAvatarEl = document.getElementById("coachAvatar");
    const feedbackAlertEl = document.getElementById("feedbackAlert");
    const choicePromptHeaderEl = document.getElementById("choicePromptHeader");
    const globalBackBtn = document.getElementById("globalBackBtn");

    // Initialize foundational text
    titleEl.textContent = opening.name;
    coachInstructionEl.textContent = opening.philosophy;

    // Parse base opening sequence (e.g. ["1. e4 e5", "2. Nf3 Nc6", "3. Bc4"])
    opening.moves.forEach(moveStr => {
        const parts = moveStr.split(" ").slice(1);
        parts.forEach(m => { if(m) cleanBaseMoves.push(m); });
    });
    baseMovesCount = cleanBaseMoves.length;

    // Run core opening lines instantly through logic framework
    cleanBaseMoves.forEach(m => game.move(m));

    // Render baseline move tag blocks
    refreshMoveTrackerBase();

    // Setup Move validation rule checker hooks
    function onDragStart(source, piece, position, orientation) {
        // Halt piece movement completely if lesson path hasn't been chosen yet
        if (!activeBranch) return false;

        // Block dragging opponent Black pieces or game-over actions
        if (game.game_over() || piece.search(/^b/) !== -1) return false;
    }

    function onDrop(source, target) {
        // Temporary preview move validation check
        const currentTargetStep = activeBranch.steps[currentStepIndex];
        
        let moveAttempt = game.move({
            from: source,
            to: target,
            promotion: 'q' // Auto-promote to queen for simplicity
        });

        // Illegal move according to general chess rule systems
        if (moveAttempt === null) return 'snapback';

        // Check if the user's move matches the exact lesson plan required notation
        if (moveAttempt.san !== currentTargetStep.notation) {
            // Undo user move instantly to force retry
            game.undo();
            triggerCoachFeedback(false, `No, that's not it! Try another square. Remember your goal: ${currentTargetStep.explanation}`);
            return 'snapback';
        }

        // --- SUCCESS STATE: User made the exact variation lesson move ---
        triggerCoachFeedback(true, `Excellent move! ${currentTargetStep.explanation}`);
        appendInteractiveMoveTag(moveAttempt.san);
        
        // Check if there are remaining steps in this roadmap path
        if (currentStepIndex < activeBranch.steps.length - 1) {
            currentStepIndex++;
            
            // Auto-respond for opponent Black after a brief delay
            setTimeout(() => {
                const blackStep = activeBranch.steps[currentStepIndex];
                const blackMove = game.move(blackStep.notation);
                
                board.position(game.fen());
                appendInteractiveMoveTag(blackMove.san);
                
                // Set up the next question sequence
                if (currentStepIndex < activeBranch.steps.length - 1) {
                    currentStepIndex++;
                    promptNextUserTurn();
                } else {
                    triggerLineCompleteState();
                }
            }, 800);

        } else {
            triggerLineCompleteState();
        }
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    // Mount Interactive Chessboard Element Frame
    board = Chessboard('chessBoard', {
        position: game.fen(), 
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });

    setTimeout(() => { board.resize(); }, 150);

    // Initial load view manager mapping choice cards
    function renderBranchOptions() {
        choicePromptHeaderEl.textContent = "Select a variation path to test your skills:";
        branchesContainerEl.innerHTML = "";
        
        opening.branches.forEach(branch => {
            const optionBox = document.createElement("button");
            optionBox.className = "branch-option";
            
            let badgeClass = "badge-solid";
            if (branch.type.toLowerCase().includes("best")) badgeClass = "badge-best";
            if (branch.type.toLowerCase().includes("risky")) badgeClass = "badge-risky";

            optionBox.innerHTML = `
                <div class="branch-header">
                    <span class="branch-title">${branch.id}) ${branch.title}</span>
                    <span class="badge ${badgeClass}">${branch.type}</span>
                </div>
            `;

            optionBox.addEventListener("click", () => {
                launchInteractiveMode(branch);
            });

            branchesContainerEl.appendChild(optionBox);
        });
    }

    function launchInteractiveMode(branch) {
        activeBranch = branch;
        currentStepIndex = 0;
        
        // Reset boards state clean to opening base before branch loops
        resetLogicStateToBase();

        // Alter Coach layout framing rules
        titleEl.textContent = `Training Line: ${branch.title}`;
        
        // Identify who plays first move in our custom data block array structure
        if (branch.steps[0].move.startsWith("White") || !branch.steps[0].move.includes("...")) {
            promptNextUserTurn();
        } else {
            // First move belongs to Black, run it instantly as a layout reaction trigger
            const opponentMove = game.move(branch.steps[0].notation);
            board.position(game.fen());
            appendInteractiveMoveTag(opponentMove.san);
            currentStepIndex = 1;
            promptNextUserTurn();
        }
    }

    function promptNextUserTurn() {
        const step = activeBranch.steps[currentStepIndex];
        triggerCoachFeedback(null, `Your Turn! Make the move: ${step.notation}. This choice aims to: ${step.explanation}`);
        
        // Render control cancel layout buttons inside choices footprint grid
        branchesContainerEl.innerHTML = `
            <button id="exitTrainingBtn" class="back-btn" style="width:100%; padding: 1rem; text-align:center;">
                🏳️ Stop Training / Choose Different Line
            </button>
        `;
        document.getElementById("exitTrainingBtn").addEventListener("click", abortTrainingLoop);
    }

    function triggerCoachFeedback(status, message) {
        coachBoxEl.classList.remove("success", "error");
        feedbackAlertEl.style.display = "block";

        if (status === true) {
            coachBoxEl.classList.add("success");
            coachAvatarEl.textContent = "🧠";
            feedbackAlertEl.style.color = "var(--type-solid)";
            feedbackAlertEl.textContent = "✔ Correct!";
            coachInstructionEl.textContent = message;
        } else if (status === false) {
            coachBoxEl.classList.add("error");
            coachAvatarEl.textContent = "⚠️";
            feedbackAlertEl.style.color = "var(--type-risky)";
            feedbackAlertEl.textContent = "❌ Try Again!";
            coachInstructionEl.textContent = message;
        } else {
            // Neutral / Next Turn Challenge
            coachAvatarEl.textContent = "🤖";
            feedbackAlertEl.style.display = "none";
            coachInstructionEl.textContent = message;
        }
    }

    function triggerLineCompleteState() {
        coachBoxEl.classList.add("success");
        coachAvatarEl.textContent = "🏆";
        feedbackAlertEl.style.color = "var(--type-solid)";
        feedbackAlertEl.textContent = "🎉 Course Challenge Met!";
        coachInstructionEl.textContent = "Fantastic job! You've successfully traversed this variation tree with perfect understanding.";

        branchesContainerEl.innerHTML = `
            <button id="completeLineBtn" class="card" style="width: 100%; text-align: center; padding: 1.2rem; background: var(--type-solid); color: #111827; border: none; font-weight: bold; font-size:1.1rem;">
                Challenge Cleared! Return to Selection Panel
            </button>
        `;
        document.getElementById("completeLineBtn").addEventListener("click", abortTrainingLoop);
    }

    function appendInteractiveMoveTag(sanText) {
        const span = document.createElement("span");
        span.className = "move-tag";
        span.style.borderColor = "var(--accent-blue)";
        span.style.color = "var(--accent-blue)";
        span.textContent = sanText;
        movesTrackerEl.appendChild(span);
    }

    function refreshMoveTrackerBase() {
        movesTrackerEl.innerHTML = "";
        opening.moves.forEach(move => {
            const span = document.createElement("span");
            span.className = "move-tag";
            span.textContent = move;
            movesTrackerEl.appendChild(span);
        });
    }

    function resetLogicStateToBase() {
        game.reset();
        cleanBaseMoves.forEach(m => game.move(m));
        board.position(game.fen());
        refreshMoveTrackerBase();
    }

    function abortTrainingLoop() {
        activeBranch = null;
        currentStepIndex = 0;
        resetLogicStateToBase();
        
        titleEl.textContent = opening.name;
        triggerCoachFeedback(null, opening.philosophy);
        renderBranchOptions();
    }

    // Mount return path to dashboard buttons redirection properties
    globalBackBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Fire default view
    renderBranchOptions();

    window.addEventListener('resize', () => {
        if (board) board.resize();
    });
});
