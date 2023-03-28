const querySearch = window.location.search

const param = new URLSearchParams(querySearch).get("id")

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
    getEventById(param)
    return data;
  } catch (error) {
    console.error(error);
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      data = await response.json();
      getEventById(param)
      return data;
    } catch {
      console.error(error);
    }
  }
}
getData()

function getEventById(id) {
  let detailsContainer = document.getElementById("details")
  let title = document.querySelector('title')
  const event = data.events.find(event => event._id == id)

  let template = ""

  if (event) {
    template = `
        <div class="d-flex col justify-content-center">
        <div class="card justify-content-between bg-dark text-white p-3 gap-1">
          <img src=${event.image} class="card-img-top rounded" alt=${event.name}>
          <div class="d-flex flex-column justify-content-center gap-2 text-center p-0 py-3">
            <h5 class="card-title fs-1 border-bottom border-danger">${event.name}</h5>
            <p class="card-text fs-4"><small>${event.date}</small></p>
            <h6 class="card-subtitle mb-2 text-white">${event.description}</h6>
          </div>
          <div class="d-flex flex-wrap justify-content-evenly w-100">
            <p class="card-text fs-4"><small>Price : $${event.price}</small></p>
            <p class="card-text fs-4"><small>${event.assistance ? 'Assistence' : 'Estimated'} : ${event.assistance ? event.assistance : event.estimate}</small></p>
          </div>
          <div class="d-flex flex-wrap justify-content-evenly align-items-center w-100 gap-1">
            <p class="card-text fs-3 border border-danger rounded px-1">${event.category}</p>
            <p class="card-text fs-3 border border-primary rounded px-1">${event.place}</p>
            <p class="card-text fs-3 border border-warning rounded px-1">${event.capacity}</p>
          </div>
        </div>
      </div>
        `
  } else {
    template = "<div><h2>No hay Detalles</h2></div>"
  }
  title.innerHTML = event.name + " | Amazing Events"
  detailsContainer.innerHTML = template
}
