// js/engine.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Determine which opening path to render from URL string parameter
    const urlParams = new URLSearchParams(window.location.search);
    const openingKey = urlParams.get('opening');
    
    const opening = openingsData[openingKey];
    
    // Redirect safe guard if url key is missing or manually mistyped
    if (!opening) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Map structural components to HTML layout IDs
    const titleEl = document.getElementById("openingTitle");
    const philosophyEl = document.getElementById("openingPhilosophy");
    const movesTrackerEl = document.getElementById("movesTracker");
    const branchesContainerEl = document.getElementById("branchesContainer");

    // 3. Render base opening data strings
    titleEl.textContent = opening.name;
    philosophyEl.textContent = opening.philosophy;

    // 4. Render primary base move notation array strings
    opening.moves.forEach(move => {
        const span = document.createElement("span");
        span.className = "move-tag";
        span.textContent = move;
        movesTrackerEl.appendChild(span);
    });

    // 5. Render tactical decision branches tree dynamically
    opening.branches.forEach(branch => {
        const optionBox = document.createElement("button");
        optionBox.className = "branch-option";
        
        // Determine type classes for colored badge chips
        let badgeClass = "badge-solid";
        if (branch.type.toLowerCase().includes("best")) badgeClass = "badge-best";
        if (branch.type.toLowerCase().includes("risky")) badgeClass = "badge-risky";

        optionBox.innerHTML = `
            <div class="branch-header">
                <span class="branch-title">${branch.id}) ${branch.title}</span>
                <span class="badge ${badgeClass}">${branch.type}</span>
            </div>
            <p class="branch-desc">${branch.explanation}</p>
            <div class="branch-moves"><strong>Resulting Variation Path:</strong> ${branch.nextMoves.join(" → ")}</div>
        `;

        // Interactive Choice Engine event system
        optionBox.addEventListener("click", () => {
            // Remove previous choice selection highlights
            document.querySelectorAll(".branch-option").forEach(box => {
                box.classList.remove("selected");
            });
            
            // Activate selection visual state
            optionBox.classList.add("selected");
        });

        branchesContainerEl.appendChild(optionBox);
    });
});
