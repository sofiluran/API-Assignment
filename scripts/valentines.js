const valentinesUrl = "https://valentines-api.vercel.app/movies"
const searchInput = document.getElementById("search-input")
const result = document.querySelector(".main")
const randomButton = document.getElementById("button-random")
let remainingMovies = []
let currentMovie = null;

const initializeMovies = async () => {
  try {
    const response = await fetch(valentinesUrl)
    if (!response.ok) throw new Error("Could not fetch API")
    remainingMovies = await response.json()
  } catch (error) {
    result.textContent = error.message;
  }
}

const callValentinesMovie = () => {
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

randomButton.addEventListener("click", callValentinesMovie)

const searchMovie = async () => {
  const searchValue = searchInput.value.trim().toLowerCase()

  if (!searchValue) {
    result.innerHTML = "NOTHING HERE"
    return
  }

  try {
    const response = await fetch(valentinesUrl)
    if (!response.ok) {
      throw new Error("Network not ok")
    }

    const movies = await response.json()
    const foundMovie = movies.find(movie => movie.title.toLowerCase().includes(searchValue))

    if (foundMovie) {
      displayResult(foundMovie)
    } else {
      result.innerHTML = "This movie is not in our Top 50 Valentines-list!"
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
  const poster = movie.poster;
  const runtime = movie.runtime
  const rating = movie.rating
  const description = movie.description
  const imdbRating = movie.imdb_rating
  const link = movie.url

  const movieDiv = document.createElement("div")
  movieDiv.classList.add("movie-container")

  movieDiv.innerHTML = `
  
  ${poster !== "N/A" ? `<img src="${poster}" alt="${title} poster">`
      : `<div></div>`
    } 
    <h2 class="movie-title movie-info"> ${title} </h2>
    <div class="movie-info"> 
    <h3>Year:</h3>
    <p>${year}</p>
    </div>
    <div class="movie-info"> 
    <h3> Imdb Rating:</h3>
    <p>${imdbRating}</p>
    </div>
    <div class="movie-info"> 
    <h3> Runtime:</h3>
    <p> ${runtime} </p>
    </div>
    <div class="movie-info"> 
    <h3> MPA Rating:</h3>
    <p>${rating}</p>
    </div>
    <p class="movie-plot"> ${description} </p>
    <button id="favouriteBtn"></button>
    <a href="${link}" id="button-random", class="imdb-button">Read more on IMDB</a>
  `
  result.appendChild(movieDiv)
  const isFav = isOnWatchlist(movie.id);
  const watchlistBtn = document.querySelector("#favouriteBtn");
  watchlistBtn.textContent = isFav ? "Remove" : "Add to Watchlist";
}

const saveToWatchlist = (list) => localStorage.setItem("favourites", JSON.stringify(list));

const getWatchlist = () => JSON.parse(localStorage.getItem("favourites") || "[]");

const isOnWatchlist = (movieId) => {
  const fav = getWatchlist();
  return fav.some(m => m.id === movieId)
}

const addToWatchlist = (movie) => {
  const fav = getWatchlist()
  if (fav.some(m => m.id === movie.id)) {
    alert("Already on the Watchlist!");
    return;
  }

  const favMovie = {
    id: movie.id,
    title: movie.title,
    year: movie.release_year,
    poster: movie.poster,
    imdb: movie.url
  }

  fav.push(favMovie);
  saveToWatchlist(fav);
  alert("Added to the Watchlist!");
}

const watchlistBtn = document.querySelector("#favouriteBtn");

watchlistBtn.addEventListener("click", () => {
  if (!currentMovie) return;

  if (isOnWatchlist(currentMovie.id)) {
    removeFromWatchlist(currentMovie.id);
    watchlistBtn.textContent = "Add to Watchlist";
  } else {
    addToWatchlist(currentMovie);
    watchlistBtn.textContent = "Remove from Watchlist";
  }
})

const removeFromWatchlist = (movieId) => {
  const fav = getWatchlist();
  const updateFav = fav.filter(m => m.id !== movieId);
  saveToWatchlist(updateFav);
  alert("Removed from Watchlist");
}
