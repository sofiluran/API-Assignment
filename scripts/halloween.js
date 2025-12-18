const halloweenApi = "https://halloween-api.vercel.app/movies"
const searchInput = document.getElementById("search-input")
const result = document.querySelector(".result")
const randomButton = document.getElementById("button-random")
let remainingMovies = []
let currentMovie = null;


const initializeMovies = async () => {
  try {
    const response = await fetch(halloweenApi)
    if (!response.ok) throw new Error("Could not fetch API")
    remainingMovies = await response.json()
  } catch (error) {
    result.textContent = error.message;
  }
}

const callHalloweenMovie = () => {
  if (remainingMovies.length === 0) {
    result.textContent = "There are no more movies in the Top 50 list!"
    randomButton.disabled = true
    return
  }

  const randomIndex = Math.floor(Math.random() * remainingMovies.length)
  const randomMovie = remainingMovies[randomIndex]

  remainingMovies.splice(randomIndex, 1)

  displayResult(randomMovie)
}

randomButton.addEventListener("click", callHalloweenMovie)

const searchMovie = async () => {
  const searchValue = searchInput.value.trim().toLowerCase()

  if (!searchValue) {
    result.innerHTML = "NOTHING HERE"
    return
  }

  try {
    const response = await fetch(halloweenApi)
    if (!response.ok) {
      throw new Error("Network not ok")
    }

    const movies = await response.json()
    const foundMovie = movies.find(movie => movie.title.toLowerCase().includes(searchValue))

    if (foundMovie) {
      displayResult(foundMovie)
    } else {
      result.innerHTML = "This movie is not in our Top 50 Halloween-list!"
    }
  } catch (error) {
    result.textContent = error
  }
}

let typingTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(typingTimer)
  typingTimer = setTimeout(searchMovie, 500)
})

const displayResult = (movie) => {
  currentMovie = movie
  result.innerHTML = ""

  const title = movie.title
  const year = movie.release_year
  const poster = movie.poster
  const runtime = movie.runtime
  const rating = movie.rating
  const description = movie.description
  const imdbRating = movie.imdb_rating
  const link = movie.url

  const movieDiv = document.createElement("div")
  movieDiv.classList.add("movie")

  movieDiv.innerHTML = `
  ${poster !== "N/A" ? `<img src="${poster}" alt="${title} poster">`
      : `<div></div>`
    } 
    <h2 class="movie-title info"> ${title} </h2>
    <div class="info"> 
    <h3>Year:</h3>
    <div>${year}</div>
    </div>
    <div class="info"> 
    <h3> Imdb Rating:</h3>
    <div>${imdbRating}</div>
    </div>
    <div class="info"> 
    <h3> Runtime:</h3>
    <div> ${runtime} </div>
    </div>
    <div class="info"> 
    <h3> MPA Rating:</h3>
    <div>${rating}</div>
    </div>
    <h3 class="movie-plot info"> ${description} </h3>
    <button id="favouriteBtn"></button>
    <a href="${link}" class="imdb-link">Read more on IMDB</a>
  `

  result.appendChild(movieDiv)

  const prefix = "halloween";
  const uniqueMovieId = `${prefix}_${movie.id}`;

  const watchlistBtn = document.querySelector("#favouriteBtn");
  const isFav = isOnWatchlist(uniqueMovieId);
  
  watchlistBtn.textContent = isFav ? "Remove" : "Add to Watchlist";

  watchlistBtn.addEventListener("click", () => {
  if (!currentMovie) return;

  if (isOnWatchlist(uniqueMovieId)) {
    removeFromWatchlist(uniqueMovieId);
    watchlistBtn.textContent = "Add to Watchlist";
  } else {
    addToWatchlist(currentMovie, prefix);
    watchlistBtn.textContent = "Remove from Watchlist";
  }
})}

initializeMovies()

const saveToWatchlist = (list) => localStorage.setItem("favourites", JSON.stringify(list));

const getWatchlist = () => JSON.parse(localStorage.getItem("favourites") || "[]");

const isOnWatchlist = (uniqueMovieId) => {
  const fav = getWatchlist();
  return fav.some(m => m.id === uniqueMovieId)
}

const addToWatchlist = (movie, prefix) => {
  const uniqueMovieId = `${prefix}_${movie.id}`;
  const fav = getWatchlist()
  if (fav.some(m => m.id === uniqueMovieId)) {
    return;
  }

  const favMovie = {
    id: uniqueMovieId,
    title: movie.title,
    year: movie.release_year,
    poster: movie.poster,
    imdb: movie.url
  }

  fav.push(favMovie);
  saveToWatchlist(fav);
  window.updateWatchlistCounter();
}

const removeFromWatchlist = (uniqueMovieId) => {
  const fav = getWatchlist();
  const updateFav = fav.filter(m => m.id !== uniqueMovieId);
  saveToWatchlist(updateFav);
  window.updateWatchlistCounter();
}