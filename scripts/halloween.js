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

  const movieDiv = document.createElement("div")
  movieDiv.classList.add("movie")

  movieDiv.innerHTML = `
  <h2> ${title} (${year}) </h2>
  ${poster !== "N/A" ? `<img src="${poster}" alt="${title} poster">`
      : `<div></div>`
    } 
  `
  result.appendChild(movieDiv)
}