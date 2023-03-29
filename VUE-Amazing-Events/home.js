const { createApp } = Vue

const app = createApp({
  data() {
    return {
      apiUrl: 'https://mindhub-xj03.onrender.com/api/amazing',
      jsonUrl: './data.json',
      data: [],
      currentDate: '',
      events: [],
      pastEvents: [],
      upcomingEvents: [],
      typeEvents: 'all',
      categories: [],
      categoriesSelected: [],
      word: '',
      loading: true,
      error: '',
      highestAttendanceEvent: {},
      lowestAttendanceEvent: {},
      highestCapacityEvent: {},
      pastEventStats: [],
      upcomingEventStats: [],
      id: 0,
      eventDetails: []
    }
  },
  created() {
    let querySearch = window.location.search
    this.id = new URLSearchParams(querySearch).get("id")

    if (window.location.pathname.includes('/past-events.html')) {
      this.typeEvents = 'past'
    } else if (window.location.pathname.includes('/upcoming-events.html')) {
      this.typeEvents = 'upcoming'
    }
    this.getData()
  },
  mounted() {
  },
  methods:{
    getData() {
      // Fetch mindhub Api
      fetch(this.apiUrl)
        .then(response => response.json())
        .then(data => {
          this.data = data.events
          this.currentDate = data.currentDate
          this.pastEvents = this.data.filter(event => new Date(Date.parse(this.currentDate)) > new Date(Date.parse(event.date)))
          this.upcomingEvents = this.data.filter(event => new Date(Date.parse(this.currentDate)) < new Date(Date.parse(event.date)))
          this.getDetails()
          if (this.typeEvents === 'past') {
            this.data = this.pastEvents
            this.events = this.pastEvents
            this.getCategories(this.events)
          } else if (this.typeEvents === 'upcoming') {
            this.data = this.upcomingEvents
            this.events = this.upcomingEvents
            this.getCategories(this.events)
          } else {
            this.events = this.data
            this.getCategories(this.events)
          }
          this.loading = false
        })
        // If fails, show error and fetch Json Data
      .catch(error => {
          console.log(error)
          this.error = error.message + ' : Fail to Get data from Mindhub!'
          fetch(this.jsonUrl)
            .then(response => response.json())
            .then(data => {
              this.data = data.events
              this.currentDate = data.currentDate
              if (this.typeEvents === 'past') {
                let pastEvents = this.data.filter(event => new Date(Date.parse(this.currentDate)) > new Date(Date.parse(event.date)))
                this.data = pastEvents
                this.events = pastEvents
                this.getCategories(this.events)
              } else if (this.typeEvents === 'upcoming') {
                let upcomingEvents = this.data.filter(event => new Date(Date.parse(this.currentDate)) < new Date(Date.parse(event.date)))
                this.data = upcomingEvents
                this.events = upcomingEvents
                this.getCategories(this.events)
              } else {
                this.events = this.data
                this.getCategories(this.events)
              }
              this.loading = false
            })
        })
    },
    getCategories(events){
      events.forEach(item => {
        if(!this.categories.includes(item.category)){
            this.categories.push(item.category)
        }
      })
    },
    getDetails() {
      this.eventDetails = this.data.find(event => event._id === Number(this.id))
    }
  },
  computed:{
    searchFilter() {
      let searchByWord = this.data.filter(item => item.name.toLowerCase().includes(this.word.toLowerCase()))
      if(!this.categoriesSelected.length){
          this.events = searchByWord
      } else {
          this.events = searchByWord.filter(item => this.categoriesSelected.includes(item.category))
      }
    },
    getHighestAttendanceEvent() {
      let highestAttendance = 0
      let highestAttendanceEvent
      this.pastEvents.forEach(item => {
        let percentage = (item.assistance * 100) / item.capacity
        if (highestAttendance < percentage) {
          highestAttendance = percentage
          highestAttendanceEvent = item.name
        }
      })
      this.highestAttendanceEvent = {total: highestAttendance, name: highestAttendanceEvent}
    },
    getLowestAttendanceEvent() {
      let lowestAttendance = 0
      let lowestAttendanceEvent
      this.pastEvents.forEach(item => {
        let percentage = (item.assistance * 100) / item.capacity
        if (lowestAttendance === 0) {
          lowestAttendance = percentage
        } else if (lowestAttendance >= percentage) {
          lowestAttendance = percentage
          lowestAttendanceEvent = item.name
        }
      })
      this.lowestAttendanceEvent = {total: lowestAttendance, name: lowestAttendanceEvent}
    },
    getHighestCapacityEvent() {
      let highestCapacity = 0
      let highestCapacityEvent
      this.pastEvents.forEach(item => {
        let capacity = item.capacity
        if (highestCapacity < capacity) {
          highestCapacity = capacity
          highestCapacityEvent = item.name
        }
      })
      this.highestCapacityEvent = {name: highestCapacityEvent, total: highestCapacity}
    },
    getPastEventsByCategories() {
      let result = this.pastEvents.reduce((acc, item) => {
        let category = item.category;
        if (!acc[category]) {
          acc[category] = {
            categories: item.category,
            price: item.price * item.assistance,
            assistance: (item.assistance * 100) / item.capacity,
            length
          };
        } else {
          acc[category].price += item.price * item.assistance;
          acc[category].assistance += (item.assistance * 100) / item.capacity;
          acc[category].length ++;
        }
        return acc;
      }, {});
      Object.values(result).forEach(event => {
        event.percentage = (event.assistance / (event.length + 1)).toFixed(2)
      })
      this.pastEventStats = Object.values(result)
    },
    getUpcomingEventsByCategories() {
      let result = this.upcomingEvents.reduce((acc, item) => {
        let category = item.category;
        if (!acc[category]) {
          acc[category] = {
            categories: item.category,
            price: item.price * item.estimate,
            estimate: (item.estimate * 100) / item.capacity,
            length
          };
        } else {
          acc[category].price += item.price * item.estimate;
          acc[category].estimate += (item.estimate * 100) / item.capacity;
          acc[category].length ++;
        }
        return acc;
      }, {});
      Object.values(result).forEach(event => {
        event.percentage = (event.estimate / (event.length + 1)).toFixed(2)
      })
      this.upcomingEventStats = Object.values(result)
    },
  }
}).mount('#App')
