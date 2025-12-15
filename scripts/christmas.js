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
const imdbButton = document.querySelector(".imdb-button");
let christmasMovies;
let remainingMovies;


const callChristmasApi = () => {
  fetch(christmasApiUrl).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to give response")
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
  movieImage.src = movie.img_src;
  movieImage.alt = movie.title;
  movieTitle.textContent = movie.title;
  movieYear.textContent = movie.release_year;
  movieRating.textContent = movie.imdb_rating;
  movieRuntime.textContent = movie.runtime;
  movieMpa.textContent = movie.rating;
  movieDescription.textContent = movie.description;
  imdbButton.href = movie.imdb_link;
})

const getRandomChristmasMovie = () => {
  let randomIndex = Math.floor(Math.random() * remainingMovies.length);
  let currentMovie = remainingMovies[randomIndex];
  remainingMovies = remainingMovies.filter(movie => movie !== currentMovie);
  return currentMovie; 
}

const searchMovie = async () => {
  let searchValue = christmasSearchInput.value.toLowerCase().trim();

  if (!searchValue) return;

  try {
    const response = await (fetch(christmasApiUrl));

    if (!response.ok) {
      throw new Error("Could not fetch resource!")
    }

    const movies = await response.json();

    const foundMovie = movies.find(movie => movie.title.toLowerCase().includes(searchValue));

    if (foundMovie) {
      displayResults(foundMovie);
    } else {
      movieTitle.textContent = "Movie is not on our list";
    }
  } catch (error) {
    movieTitle.textContent = error;
  }
}

let typingTimer;

christmasSearchInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchMovie, 500);
})

const displayResults = (movie) => {
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
}