const querySearch = window.location.search

console.log(querySearch);

const param = new URLSearchParams(querySearch).get("id")

console.log(param);

function getEventById(id) {
  let detailsContainer = document.getElementById("details")

  const event = data.events.find(event => event._id == id)
  console.log(event)

  let template = ""

  if (event) {
    template = `
        <div class="card border-0 bg-dark my-1 mx-1 mx-md-5 p-3">
          <div class="row justify-content-evenly gap-1 g-0">
            <div class="d-flex col-md-5 rounded border border-danger">
              <img style="object-fit:cover;" src=${event.image} class="img-fluid rounded" alt=${event.name}>
            </div>
            <div class="col-md-5 bg-light rounded border border-danger">
              <div class="card-body d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                <div class="d-flex flex-wrap justify-content-between align-items-center w-100 border-bottom border-danger">
                  <h5 class="card-title fs-1">${event.name}</h5>
                  <p class="card-text fs-4"><small class="text-muted">${event.date}</small></p>
                </div>
                <p class="card-text fs-2">${event.description}</p>
                <div class="d-flex flex-wrap justify-content-evenly w-100">
                  <p class="card-text fs-4"><small class="text-muted">Price : $${event.price}</small></p>
                  <p class="card-text fs-4"><small class="text-muted">Assistence : ${event.assistance}</small></p>
                </div>
                <div class="d-flex flex-wrap justify-content-evenly align-items-center w-100 gap-1">
                  <p class="card-text fs-3 border border-danger rounded px-1">${event.category}</p>
                  <p class="card-text fs-3 border border-primary rounded px-1">${event.place}</p>
                  <p class="card-text fs-3 border border-warning rounded px-1">${event.capacity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
  } else {
    template = "<div><h2>No hay Detalles</h2></div>"
  }

  detailsContainer.innerHTML = template
}

getEventById(param)