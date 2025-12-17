const christmasApiUrl = "https://christmas-api.vercel.app/movies";
const christmasSearchButton = document.querySelector(".button-random");
const christmasSearchInput = document.querySelector(".search-input");
const mainContent = document.querySelector(".main-content");
const gridContent = document.querySelector(".movie-grid-container");
const movieImage = document.querySelector(".movie-image-container img");
const movieTitle = document.querySelector(".movie-title");
const movieYear = document.querySelector(".movie-year");
const movieRating = document.querySelector(".movie-rating");
const movieRuntime = document.querySelector(".movie-runtime");
const movieMpa = document.querySelector(".movie-mpa");
const movieDescription = document.querySelector(".movie-description");
const statusMessage = document.querySelector(".status-message");
const imdbButton = document.querySelector(".imdb-button");
let christmasMovies = [];
let remainingMovies = []; 
let currentMovie = null;


const callChristmasApi = () => {
  fetch(christmasApiUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to give response: ${response.status}`);
    }
    return response.json()
  }).then((data) => {
    christmasMovies = data;
    remainingMovies = Array.from(christmasMovies);
    console.log(data)
  }).catch((error) => {
    console.error("Error fetching API", error)
  })
}

callChristmasApi();

christmasSearchButton.addEventListener("click", () => {
  mainContent.classList.add("active");
  gridContent.classList.add("active");
  const movie = getRandomChristmasMovie();
  if (movie) {
    displayResults(movie);
  }
})

const getRandomChristmasMovie = () => {
  statusMessage.style.display = "none";
  gridContent.style.display = ""
  if (remainingMovies.length === 0) {
    statusMessage.style.display = "flex";
    gridContent.style.display = "none";
    statusMessage.textContent = "You have gone through all the movies on our list.";
    remainingMovies = Array.from(christmasMovies);
    return null;
  }
  statusMessage.textContent = "";
  statusMessage.style.display = "none";
  let randomIndex = Math.floor(Math.random() * remainingMovies.length);
  let currentMovie = remainingMovies[randomIndex];
  remainingMovies = remainingMovies.filter(movie => movie !== currentMovie);
  return currentMovie;
}

const searchMovie = async () => {
  statusMessage.style.display = "none";
  gridContent.style.display = "";
  let searchValue = christmasSearchInput.value.toLowerCase().trim();

  if (!searchValue) return;

  try {
    const response = await (fetch(christmasApiUrl));

    if (!response.ok) {
      throw new Error(`Could not fetch resource: ${response.status}`)
    }

    const movies = await response.json();

    const foundMovie = movies.find(movie => movie.title.toLowerCase().includes(searchValue));

    if (foundMovie) {
      displayResults(foundMovie);
    } else {
      statusMessage.style.display = "block";
      gridContent.style.display = "none";
      statusMessage.textContent = "Movie is not on our list!";
    }
  } catch (error) {
    console.error("Error fetching API", error)
  }
}

let typingTimer;

christmasSearchInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchMovie, 500);
})

const displayResults = (movie) => {
  currentMovie = movie;
  mainContent.classList.add("active");
  gridContent.classList.add("active");
  movieImage.src = movie.img_src;
  movieImage.alt = movie.title;
  movieTitle.textContent = movie.title;
  movieYear.textContent = movie.release_year;
  movieRating.textContent = movie.imdb_rating;
  movieRuntime.textContent = movie.runtime;
  movieMpa.textContent = movie.rating;
  movieDescription.textContent = movie.description;

  imdbButton.href = movie.imdb_link;

  const prefix = "christmas";
  const uniqueMovieId = `${prefix}_${movie.id}`;

  const isFav = isOnWatchlist(uniqueMovieId);
  const watchlistBtn = document.querySelector("#favouriteBtn");
  watchlistBtn.textContent = isFav ? "Remove" : "Add to Watchlist";
}

const saveToWatchlist = (list) => localStorage.setItem("favourites", JSON.stringify(list));

const getWatchlist = () => JSON.parse(localStorage.getItem("favourites") || "[]");

const isOnWatchlist = (uniqueMovieId) => {
  const fav = getWatchlist();
  return fav.some(m => m.id === uniqueMovieId)
} 

const addToWatchlist = (movie, prefix) => {
  const uniqueMovieId = `${prefix}_${movie.id}`;
  const fav = getWatchlist();
  if (fav.some(m => m.id === uniqueMovieId)) {
    return;
  }

  const favMovie = {
    id: uniqueMovieId,
    title: movie.title,
    year: movie.release_year,
    poster: movie.img_src,
    imdb: movie.imdb_link
  }

  fav.push(favMovie);
  saveToWatchlist(fav);
  window.updateWatchlistCounter();
}

const watchlistBtn = document.querySelector("#favouriteBtn");

watchlistBtn.addEventListener("click", () => {
  if(!currentMovie) return;

  const prefix = "christmas";
  const uniqueMovieId = `${prefix}_${currentMovie.id}`;

  if (isOnWatchlist(uniqueMovieId)) {
    removeFromWatchlist(uniqueMovieId);
    watchlistBtn.textContent = "Add to Watchlist";
  }else {
    addToWatchlist(currentMovie, prefix);
    watchlistBtn.textContent = "Remove from Watchlist";
  }
})

const removeFromWatchlist = (uniqueMovieId) => {
  const fav = getWatchlist();
  const updateFav = fav.filter(m => m.id !== uniqueMovieId);
  saveToWatchlist(updateFav);
  window.updateWatchlistCounter();
}