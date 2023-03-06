const newEvents = []

for (const event of data.events) {
  if (new Date(Date.parse(data.currentDate)) < new Date(Date.parse(event.date))) {
    newEvents.push(event)
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

paintCardCointainer(newEvents)