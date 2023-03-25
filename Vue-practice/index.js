const { createApp } = Vue

createApp({
  data() {
    return {
      message: 'Hola mundo!',
      character: {},
      loading: false
    }
  },
  mounted() {
    this.loading = true
    fetch('https://swapi.dev/api/people/1/')
    .then(response => response.json())
    .then(data => {
      this.character = data
      this.loading = false
    })
  }
}).mount('#app')
