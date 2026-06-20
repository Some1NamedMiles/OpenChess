const container = document.getElementById("openingsContainer");
const searchBar = document.getElementById("searchBar");

const openings = [
  {
    name: "Italian Game",
    link: "openings/italian.html",
    description: "Learn the classic attacking opening."
  },
  {
    name: "London System",
    link: "openings/london.html",
    description: "Solid setup for consistent play."
  },
  {
    name: "Sicilian Defense",
    link: "openings/sicilian.html",
    description: "Sharp and aggressive response to 1.e4."
  }
];

function render(list) {
  container.innerHTML = "";

  list.forEach(o => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${o.name}</h3>
      <p>${o.description}</p>
    `;

    card.onclick = () => {
      window.location.href = o.link;
    };

    container.appendChild(card);
  });
}

render(openings);

searchBar.addEventListener("input", () => {
  const value = searchBar.value.toLowerCase();
  render(openings.filter(o => o.name.toLowerCase().includes(value)));
});
