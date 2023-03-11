const pastEvents = []

for (const event of data.events) {
  if (new Date(Date.parse(data.currentDate)) > new Date(Date.parse(event.date))) {
    pastEvents.push(event)
  }
}

function paintCardCointainer(events) {
  let template = ""
  let cardContainer = document.getElementById("card-container")

  for( const event of events){
    template += `
      <div class="col">
        <div class="card bg-dark text-white p-3">
          <img src=${event.image} class="card-img-top rounded" alt="...">
          <div class="card-body text-center p-0 py-3">
            <h5 class="card-title">${event.name}</h5>
            <h6 class="card-subtitle mb-2 text-white">${event.description}</h6>
          </div>
          <div class="d-flex justify-content-between align-items-center p-2">
            <span>Price $${event.price}</span>
            <a href="./event-details.html" class="btn btn-danger">View More...</a>
          </div>
        </div>
      </div>
      `
  }
  cardContainer.innerHTML = template
}

paintCardCointainer(pastEvents)

function addCategories() {
  let categories = []

  pastEvents.map((item) => {
    categories.push(item.category)
  })

  let categoriesFilter = categories.reduce((acumulador, elemento) => {
    if (!acumulador.includes(elemento)) {
      acumulador.push(elemento);
    }
    return acumulador;
  }, []);

  let template = ""
  let checkboxContainer = document.getElementById("checkbox-container")

  categoriesFilter.map((item, index) => {
    template += `
    <div class="form-check form-check-inline m-0">
      <input class="form-check-input" type="checkbox" id=${`inlineCheckbox${index}`} value=${item}>
      <label class="form-check-label" for=${`inlineCheckbox${index}`}>${item}</label>
    </div>
      `
  })
  checkboxContainer.innerHTML = template
}

addCategories()

function searchByCategories(category) {
  let results = []
  if (category !== '')  {
    results = pastEvents.filter((item) => {
      return item.category.includes(category);
    })
  }

  return results
}

let checkbox = document.getElementById("checkbox-container")

let categoriesCheckbox = []

checkbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    categoriesCheckbox = categoriesCheckbox.concat(searchByCategories(e.target.value))
  } else {
    categoriesCheckbox = categoriesCheckbox.filter(item => !item.category.includes(e.target.value));
  }
  
  return categoriesCheckbox.length === 0 ? paintCardCointainer(pastEvents) : paintCardCointainer(categoriesCheckbox)
})

// -------------------- SEARCH --------------------
function search(word) {
  let results = []
  results = pastEvents.filter((item) => {
    return item.name.toLowerCase().includes(word);
  })  

  return results
}

let searchButton = document.getElementById("search-form")

searchButton.addEventListener('submit', (e) => {
  e.preventDefault()

  let results = search(e.target[0].value)

  if (results.length === 0) {
    let notResults = `
    <div class="d-flex flex-column align-items-center gap-2 w-100">
      <h2>No hay resultados para la busqueda : ${e.target[0].value}</h2>
      <button class="btn btn-outline-danger" type="button" id="back-button">Volver</button>
    </div>
    `
    cardContainer.innerHTML = notResults
  
    let backButton = document.getElementById("back-button")
  
    backButton.addEventListener('click', () => {
      searchButton[0].value = ''
      paintCardCointainer(pastEvents)
    })
  } else {
    paintCardCointainer(results)
  }
})
