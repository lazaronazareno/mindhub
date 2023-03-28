let form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  values = {}
  for (item of e.target) {
    if (item.value !== '') {
      values = {...values, [item.id] : item.value}
    }
  }
  
  console.log(values)
  return values
})