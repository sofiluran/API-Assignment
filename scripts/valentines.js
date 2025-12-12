const apiKey = "d2db7f69"
const apiUrl = "https://www.omdbapi.com/"
const searchInput = document.getElementById("search-input")
const result = document.querySelector(".result")


const searchMovie = async () => {

  const searchValue = searchInput.value.trim()
  const url = `${apiUrl}?apikey=${apiKey}&t=${searchValue}`

  try {
    const response = await (fetch(url))

    if (!response.ok) {
      throw new Error("Network not ok")
    }

    const movie = await response.json()

    if (movie.Response === "True") {
      console.log("Movie", movie)
      displayResult(movie)
    } else {
      result.textContent = ""
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

  const title = movie.Title
  const year = movie.Year
  const poster = movie.Poster
  const runtime = movie.Runtime
  const rating = movie.Rated
  const plot = movie.Plot
  const imdbRating = movie.imdbRating

  const movieDiv = document.createElement("div")
  movieDiv.classList.add("movie")

  movieDiv.innerHTML = `
  
  ${poster !== "N/A" ? `<img src="${poster}" alt="${title} poster">`
      : `<div></div>`
    } 
    <h2 class="movie-title info"> ${title} </h2>
    <h3 class="info"> ${year} </h3>
    <h3 class="info"> Imdb Rating: ${imdbRating} </h3>
    <h3 class="info"> Runtime: ${runtime} </h3>
    <h3 class="info"> ${rating} </h3>
    <h3 class="movie-plot info"> ${plot} </h3>
  `
  result.appendChild(movieDiv)
}
