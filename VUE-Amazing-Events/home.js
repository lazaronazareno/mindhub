const { createApp } = Vue

const app = createApp({
  data() {
    return {
      apiUrl: 'https://mindhub-xj03.onrender.com/api/amazing',
      jsonUrl: './data.json',
      data: [],
      events: [],
      categories: [],
      categoriesSelected: [],
      word: '',
      loading: true,
      error : ''
    }
  },
  created() {
    this.getData()
  },
  mounted(){

  },
  methods:{
    getData() {
      // Fetch mindhub Api
      fetch(this.apiUrl)
        .then(response => response.json())
        .then(data => {
          this.data = data.events
          this.events = this.data
          this.getCategories(this.events)
          this.loading = false
        })
        // If fails, show error and fetch Json Data
      .catch(error => {
          console.log(error)
          this.error = error.message + ' : Fail to Get data from Mindhub!'
          fetch(this.jsonUrl)
            .then(response => response.json())
            .then(data => {
              this.error = ''
              this.data = data.events
              this.events = this.data
              this.getCategories(this.events)
              this.loading = false
            })
        })
    },
    getCategories(array){
      array.forEach(item => {
        if(!this.categories.includes(item.category)){
            this.categories.push(item.category)
        }
      })
  },
  },
  computed:{
    searchFilter() {
      let searchByWord = this.data.filter(item => item.name.toLowerCase().includes(this.word.toLowerCase()))
      if(!this.categoriesSelected.length){
          this.events = searchByWord
      } else {
          this.events = searchByWord.filter(item => this.categoriesSelected.includes(item.category))
      }
    }
  }
}).mount('#App')
