let data 
let error
let apiUrl = 'https://mindhub-xj03.onrender.com/api/amazing'
let jsonUrl = './data.json'

async function getData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    data = await response.json();
    getPastEvents()
    getNewEvents()
    getHighestAttendanceEvent()
    getLowestAttendanceEvent()
    getLargerCapacityEvent()
    getPastStatsByCategory()
    getUpcomingStatsByCategory()
    return data;
  } catch (error) {
    console.error(error);
    try {
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        throw new Error('Request failed');
      }
      data = await response.json();
      getPastEvents()
      getNewEvents()
      getHighestAttendanceEvent()
      getLowestAttendanceEvent()
      getLargerCapacityEvent()
      getPastStatsByCategory()
      getUpcomingStatsByCategory()
      return data;
    } catch {
      console.error(error);
    }
  }
}
getData()

const pastEvents = []
const newEvents = []

function getPastEvents() {
  for (const event of data.events) {
    if (new Date(Date.parse(data.currentDate)) > new Date(Date.parse(event.date))) {
      pastEvents.push(event)
    }
  }
}

function getNewEvents() {
  for (const event of data.events) {
    if (new Date(Date.parse(data.currentDate)) < new Date(Date.parse(event.date))) {
      newEvents.push(event)
    }
  }
}

let highestAttendance = 0
let highestAttendanceEvent

let highestAttendanceColumn = document.getElementById('highestPercentage')

function getHighestAttendanceEvent() {
  for (const event of pastEvents) {
    let percentage = (event.assistance * 100) / event.capacity
    if (highestAttendance < percentage) {
      highestAttendance = percentage
      highestAttendanceEvent = event
    }
  }
  highestAttendanceColumn.innerHTML = `${highestAttendanceEvent.name} - ${highestAttendance.toFixed(1)}%`
}

let lowestAttendance = 0
let lowestAttendanceEvent

let lowestAttendanceColumn = document.getElementById('lowestPercentage')

function getLowestAttendanceEvent() {
  for (const event of pastEvents) {
    let percentage = (event.assistance * 100) / event.capacity
    if (lowestAttendance === 0) {
      lowestAttendance = percentage
    } else if (lowestAttendance >= percentage) {
      lowestAttendance = percentage
      lowestAttendanceEvent = event
    }
  }
  lowestAttendanceColumn.innerHTML = `${lowestAttendanceEvent.name} - ${lowestAttendance.toFixed(1)}%`
}

let highestCapacity = 0
let highestCapacityEvent = 0

let largerCapacityColumn = document.getElementById('largerCapacity')

function getLargerCapacityEvent() {
  for (const event of pastEvents) {
    let capacity = event.capacity
    if (highestCapacity < capacity) {
      highestCapacity = capacity
      highestCapacityEvent = event
    }
  }
  largerCapacityColumn.innerHTML = `${highestCapacityEvent.name} - ${highestCapacity}`
}

function getPastStatsByCategory() {
  let categories = []

  pastEvents.map((item) => {
    let newObject = {} 
    newObject.categories = (item.category)
    newObject.price = (item.price * item.assistance)
    newObject.assistance = (item.assistance*100)/item.capacity

    categories.push(newObject)
  })

  let template = `
    <tr class="table-secondary">
      <td class="w-25">Categories</td>
      <td class="w-25">Revenues</td>
      <td class="w-25">Percentage of attendance</td>
    </tr>
  `
  let pastEventsTable = document.getElementById('past-events-category')

  let result = categories.reduce((acc, obj) => {
    let category = obj.categories;
    if (!acc[category]) {
      acc[category] = {
            categories : obj.categories,
            price : obj.price,
            assistance: obj.assistance,
            length
        };
    } else {
        acc[category].categories = obj.categories;
        acc[category].price += obj.price;
        acc[category].assistance += obj.assistance;
        acc[category].length ++;
    }
    return acc;
  }, {});

  for (const table of Object.values(result)) {
    template += `
    <tr>
      <td>${table.categories}</td>
      <td>${table.price}</td>
      <td>${(table.assistance / (table.length + 1)).toFixed(2)}%</td>
    </tr>
    `
  }

  pastEventsTable.innerHTML = template

}

function getUpcomingStatsByCategory() {
  let categories = []

  newEvents.map((item) => {
    let newObject = {} 
    newObject.categories = (item.category)
    newObject.price = (item.price * item.estimate)
    newObject.estimate = (item.estimate*100)/item.capacity

    categories.push(newObject)
  })

  let template = `
    <tr class="table-secondary">
      <td class="w-25">Categories</td>
      <td class="w-25">Revenues</td>
      <td class="w-25">Percentage of attendance</td>
    </tr>
  `
  let upcomingEventsTable = document.getElementById('upcoming-events-category')

  let result = categories.reduce((acc, obj) => {
    let category = obj.categories;
    if (!acc[category]) {
      acc[category] = {
            categories : obj.categories,
            price : obj.price,
            estimate: obj.estimate,
            length
        };
    } else {
        acc[category].categories = obj.categories;
        acc[category].price += obj.price;
        acc[category].estimate += obj.estimate;
        acc[category].length ++;
    }
    return acc;
  }, {});

  for (const table of Object.values(result)) {
    template += `
    <tr>
      <td>${table.categories}</td>
      <td>${table.price}</td>
      <td>${(table.estimate / (table.length + 1)).toFixed(2)}%</td>
    </tr>
    `
  }

  upcomingEventsTable.innerHTML = template

}

