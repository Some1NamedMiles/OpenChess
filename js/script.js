// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("gridContainer");
    const searchBar = document.getElementById("searchBar");

    let currentMatches = [];

    function renderCards(filterText = "") {
        gridContainer.innerHTML = "";
        currentMatches = [];
        
        for (const key in openingsData) {
            const opening = openingsData[key];
            
            const matchesSearch = opening.name.toLowerCase().includes(filterText.toLowerCase()) || 
                                  opening.description.toLowerCase().includes(filterText.toLowerCase());
            
            if (matchesSearch) {
                currentMatches.push(key);
                
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <h3>${opening.name}</h3>
                    <p>${opening.description}</p>
                `;
                
                // FIXED FOR GITHUB PAGES: Explicit relative URL execution
                card.addEventListener("click", () => {
                    window.location.href = "lesson.html?opening=" + key;
                });
                
                gridContainer.appendChild(card);
            }
        }
    }

    searchBar.addEventListener("input", (e) => {
        renderCards(e.target.value);
    });

    searchBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); 
            if (currentMatches.length > 0) {
                window.location.href = "lesson.html?opening=" + currentMatches[0];
            }
        }
    });

    // Populate instantly on load
    renderCards("");
});
