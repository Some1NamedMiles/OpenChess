// js/script.js
document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("gridContainer");
    const searchBar = document.getElementById("searchBar");

    function renderCards(filterText = "") {
        gridContainer.innerHTML = "";
        
        // Loop through the data keys
        for (const key in openingsData) {
            const opening = openingsData[key];
            
            // Filter logic
            if (opening.name.toLowerCase().includes(filterText.toLowerCase()) || 
                opening.description.toLowerCase().includes(filterText.toLowerCase())) {
                
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <h3>${opening.name}</h3>
                    <p>${opening.description}</p>
                `;
                
                // Redirect to template page passing key query parameter
                card.addEventListener("click", () => {
                    window.location.href = `lesson.html?opening=${key}`;
                });
                
                gridContainer.appendChild(card);
            }
        }
    }

    // Search bar event listener
    searchBar.addEventListener("input", (e) => {
        renderCards(e.target.value);
    });

    // Initial load execution
    renderCards();
});
