const ulTransacoes = document.getElementById('transactions')

const converterMoedaParaBRL = valor =>
  valor.toLocaleString('pt-BR',
  { 
    style: 'currency',
    currency: 'BRL'
  })

const aplicarMascaraMoeda = input => {
  const inputValue = input.value.trim()

  let result = inputValue.toString().replace(/[^\d]+/g, '')
  result = result.replace(/([\d]{2})$/, ".$1")

  if (result.length > 6) {
    result = result.replace(/\B(?=(\d{3})+[^\d])/g, "," )
  }

  input.value = result
}

const buscarDadosLocalStorage = () => {
  const dadosTransacoes = localStorage.getItem('transacoes')

  return JSON.parse(dadosTransacoes)
}

const persistirTransacoesLocalStorage = transacoes => {
  localStorage.setItem('transacoes', JSON.stringify(transacoes))
}

const exibirTransacao = ({ id, nome, valor }) => {
  const operador = valor < 0 ? '-' : ''
  const classeASerAplicada = valor < 0 ? 'minus' : 'plus'
  const li = document.createElement('li')

  li.setAttribute('data-id', id)
  li.classList.add(classeASerAplicada)

  const conteudoLi = `
    ${nome} <span>${operador} ${converterMoedaParaBRL(Math.abs(valor))}</span>
    <button class="delete-btn">x</button>
  `

  li.innerHTML = conteudoLi
  ulTransacoes.prepend(li)
}

const calcularDespesas = arrayTransacoes => {
  const balancoContainer = document.getElementById('balance')
  const receitasContainer = document.getElementById('money-plus')
  const despesasContainer = document.getElementById('money-minus')
  
  const totalTransacoes = arrayTransacoes
    .reduce((acc, { valor }) => {
      const transacao = valor < 0 ? 'despesas' : 'receitas'
      acc[transacao] = acc[transacao] + Math.abs(valor)

      return acc
    }, { despesas: 0, receitas: 0 })

  const { receitas, despesas } = totalTransacoes
  const saldoAtual = receitas - despesas

  balancoContainer.innerText = converterMoedaParaBRL(saldoAtual)
  receitasContainer.innerText = `+ ${converterMoedaParaBRL(receitas)}`
  despesasContainer.innerText = `- ${converterMoedaParaBRL(despesas)}`
}

const atualizarInformacoes = transacoes => {
  calcularDespesas(transacoes)

  if (transacoes.length !== 0) {
    ulTransacoes.innerHTML = ''
  
    persistirTransacoesLocalStorage(transacoes)
  
    transacoes.forEach(exibirTransacao)
  }
}

const excluirTransacao = event => {
  const elementoClicado = event.target

  if (elementoClicado.tagName === 'BUTTON') {
    const liTransacao = elementoClicado.closest('li')
    const idTransacaoASerExcluida = liTransacao.dataset.id
    const transacoes = buscarDadosLocalStorage()

    const indexTransacao = transacoes
      .findIndex(({ id }) => id === idTransacaoASerExcluida)

    transacoes.splice(indexTransacao, 1)
    liTransacao.remove()

    atualizarInformacoes(transacoes)
    persistirTransacoesLocalStorage(transacoes)
  }
}

const gerarId = () => Date.now() + Math.floor(Math.random() * 1000)

const adicionarTransacao = event => {
  event.preventDefault()
  
  const transacoes = buscarDadosLocalStorage()
  const form = event.target
  const nome = form.text.value.trim()
  const valor = form.amount.value.trim().replaceAll(',', '')

  if (!nome || !valor) {
    console.log(`Preencha corretamente`)
    return
  }

  const despesa = {
    id: gerarId(),
    nome,
    valor
  }
  
  transacoes.push(despesa)
  atualizarInformacoes(transacoes)

  form.text.value = ''
  form.amount.value = ''
}

const abrirPopup = () => {
  const popup = document.querySelector('.popup-wrapper')
  
  popup.classList.toggle('d-none')
}

const fecharPopup = e => {
  const elementoClicado = e.target
  const classesParaFechar = ['popup-wrapper', 'popup-close', 'add-transaction']
  
  const elementoClicadoPossuiClasse = [...elementoClicado.classList]
    .some(classe => classesParaFechar.includes(classe))

  if(elementoClicadoPossuiClasse) {
    popupContainer.classList.toggle('d-none')
  }
}

const btnAdicionarTransacao = document.getElementById('btn-add-transaction')
btnAdicionarTransacao.addEventListener('click', abrirPopup)

const popupContainer = document.querySelector('.popup-wrapper')
popupContainer.addEventListener('click', fecharPopup)

const form = document.getElementById('form')
form.addEventListener('submit', adicionarTransacao);
ulTransacoes.addEventListener('click', excluirTransacao)

window.onload = () => {
  const transacoes = localStorage.getItem('transacoes')
  
  if(!transacoes) {
    localStorage.setItem('transacoes', JSON.stringify([]))
    return
  }
  atualizarInformacoes(JSON.parse(transacoes))
}