const halloweenApi = "https://halloween-api.vercel.app/movies"
const searchInput = document.getElementById("search-input")
const result = document.querySelector(".result")
const randomButton = document.getElementById("button-random")

const callHalloweenMovie = async () => {
  try {
    const response = await (fetch(halloweenApi))

    if (!response.ok) {
      throw new Error("Could not fetch API")
    }

    const movies = await response.json()
    const randomMovie = movies[Math.floor(Math.random() * movies.length)]

    displayResult(randomMovie)

  } catch (error) {
    result.textContent = error
  }
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
    <a href="${link}" class="imdb-link">Read more on IMDB</a>
  `
  result.appendChild(movieDiv)
}

