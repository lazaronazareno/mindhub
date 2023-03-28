let cardContainer = document.getElementById("card-container")

let data 
let apiUrl = 'https://mindhub-xj03.onrender.com/api/amazing'
let jsonUrl = './data.json'

async function getData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    data = await response.json();
    getNewEvents()
    paintCardCointainer(newEvents)
    addCategories()
    return data;
  } catch (error) {
    console.error(error);
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      data = await response.json();
      getNewEvents()
      paintCardCointainer(newEvents)
      addCategories()
      return data;
    } catch {
      console.error(error);
    }
  }
}
getData()

const newEvents = []

function getNewEvents() {
  for (const event of data.events) {
    if (new Date(Date.parse(data.currentDate)) < new Date(Date.parse(event.date))) {
      newEvents.push(event)
    }
  }
}

function paintCardCointainer(events) {
  let template = ""

  for( const event of events){
    template += `
      <div class="d-flex col justify-content-center">
        <div class="card bg-dark text-white p-3">
          <img src=${event.image} class="card-img-top rounded" alt="...">
          <div class="card-body text-center p-0 py-3">
            <h5 class="card-title">${event.name}</h5>
            <h6 class="card-subtitle mb-2 text-white">${event.description}</h6>
          </div>
          <div class="d-flex justify-content-between align-items-center p-2">
            <span>Price $${event.price}</span>
            <a href="./event-details.html?id=${event._id}" class="btn btn-danger">View More...</a>
          </div>
        </div>
      </div>
      `
  }
  cardContainer.innerHTML = template
}

function addCategories() {
  let categories = []

  newEvents.map((item) => {
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

function searchByCategories(category) {
  let results = []
  if (category !== '')  {
    results = newEvents.filter((item) => {
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
  
  return categoriesCheckbox.length === 0 ? paintCardCointainer(newEvents) : paintCardCointainer(categoriesCheckbox)
})

// -------------------- SEARCH --------------------
function search(word, data) {
  let results = []
  results = data.filter((item) => {
    return item.name.toLowerCase().includes(word.toLowerCase());
  })  

  return results
}

let searchForm = document.getElementById("search-form")
let searchInput = document.getElementById("search-input")

searchForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let results = categoriesCheckbox.length > 0 ? search(e.target[0].value, categoriesCheckbox) : search(e.target[0].value, newEvents)

  if (results.length === 0) {
    let notResults = `
    <div class="d-flex flex-column align-items-center gap-2 w-100">
      <h2>No hay resultados para la busqueda : ${e.target[0].value}</h2>
      <button class="btn btn-outline-danger" type="button" id="back-button">Volver</button>
    </div>
    `
    searchForm[0].value = ''
    cardContainer.innerHTML = notResults
    
    let backButton = document.getElementById("back-button")
    
    backButton.addEventListener('click', () => {
      paintCardCointainer(newEvents)
    })
  } else {
    searchForm[0].value = ''
    paintCardCointainer(results)
  }
})

searchInput.addEventListener('input', (e) => {
  let results = categoriesCheckbox.length > 0 ? search(e.target.value, categoriesCheckbox) : search(e.target.value, newEvents)

  if (results.length === 0) {
    let notResults = `
    <div class="d-flex flex-column align-items-center gap-2 w-100">
      <h2>No hay resultados para la busqueda : ${e.target.value}</h2>
      <button class="btn btn-outline-danger" type="button" id="back-button">Volver</button>
    </div>
    `
    cardContainer.innerHTML = notResults
  
    let backButton = document.getElementById("back-button")
  
    backButton.addEventListener('click', () => {
      paintCardCointainer(newEvents)
    })
  } else { 
    paintCardCointainer(results)
  }
})
