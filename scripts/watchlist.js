window.addEventListener("DOMContentLoaded", () => {
  const favContainer = document.querySelector(".favourites");
  const favs = JSON.parse(localStorage.getItem("favourites") || "[]");

  if (!favContainer) return;

  favContainer.innerHTML = "";

  if (favs.length === 0) {
    favContainer.innerHTML = `<p class="empty-list">No favourites yet</p>`;
  } else {
    favs.forEach(movie => {
      const div = document.createElement("div");
      div.className = "fav";
      const isFav = true;

      div.innerHTML = `
        <h3>${movie.title} (${movie.year})</h3>
        <img src="${movie.poster}" alt="${movie.title} poster"/>
        <button class="favToggleBtn">${isFav ? "Remove from Watchlist" : "Add to Watchlist"}</button>
        <a href="${movie.imdb}" class="imdb-button">Read more on IMDB</a>
      `;

      const toggleBtn = div.querySelector(".favToggleBtn");
      toggleBtn.addEventListener("click", () => {
        const favsList = JSON.parse(localStorage.getItem("favourites") || "[]");
        const isCurrentlyFav = favsList.some(m => m.id === movie.id);

        if (isCurrentlyFav) {
          const updatedFavs = favsList.filter(m => m.id !== movie.id);
          localStorage.setItem("favourites", JSON.stringify(updatedFavs));
          div.remove();
          alert("Removed from favourites!");
        }
        if (document.querySelectorAll(".favourites .fav").length === 0) {
          favContainer.innerHTML = `<p class="empty">No favourites yet.</p>`;
        }
      });
      favContainer.appendChild(div);
    });
  }
});