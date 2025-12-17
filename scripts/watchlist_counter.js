document.addEventListener("DOMContentLoaded", () => {
  const watchlistCounter = document.querySelector(".watchlist-counter");

  const updateWatchlistCounter = () => {
    if (!watchlistCounter) return;
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    watchlistCounter.textContent = favs.length;
  }

  updateWatchlistCounter();
  window.updateWatchlistCounter = updateWatchlistCounter;
})