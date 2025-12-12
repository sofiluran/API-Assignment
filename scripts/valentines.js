const apiKey = "d2db7f69"
const apiUrl = "https://www.omdbapi.com/"
const searchInput = document.getElementById("search-input")
const result = document.querySelector(".main")


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
  movieDiv.classList.add("movie-container")

  movieDiv.innerHTML = `
  
  ${poster !== "N/A" ? `<img src="${poster}" alt="${title} poster">`
      : `<div></div>`
    } 
    <div class="movie-info">
      <h2> <b>${title}</b> </h2>
      <div class="movie-stats">
        <h3> <b>Year</b> <br><br> ${year} </h3>
        <h3> <b>Imdb Rating</b> <br><br> ${imdbRating} </h3>
        <h3> <b>Runtime</b> <br><br> ${runtime} </h3>
        <h3> <b>MPA</b> <br><br> ${rating} </h3>
      </div>
      <h3> ${plot} </h3>
    </div>
  `
  result.appendChild(movieDiv)
}
