const aplicarMascaraMoeda = input => {
  const inputValue = input.value.trim()

  let result = inputValue.toString().replace(/[^\d]+/g, '')
  result = result.replace(/([\d]{2})$/, ".$1")

  if (result.length > 6) {
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, "," )
  }
  input.value = result
}

const converterMoedaParaBRL = valor =>
  valor.toLocaleString('pt-BR',
  { 
    style: 'currency',
    currency: 'BRL'
  })

const converterDataParaBr = data => {
  data.setDate(data.getDate() + 1)

  return data.toLocaleString('pt-BR',
    { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   })

}


export { converterMoedaParaBRL, aplicarMascaraMoeda, converterDataParaBr }