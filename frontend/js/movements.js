import {initCalcs} from './balance.js'

const tableBody = document.querySelector('.table-movements tbody')
const formAddMovement = document.querySelector('.form-add-movement')
const formInputs = formAddMovement.querySelectorAll('input') 
const main = document.querySelector('main')

const url = "http://localhost:3083/"

const getAllMovements = async () => {
    const newUrl = url + 'getMovements'
    const response = await fetch(newUrl)
    const resJson = await response.json()
    return resJson
}

const addMovements = async (movement) => {
    const newUrl = url + 'addMovement'
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movement)
    }
    const response = await fetch(newUrl, options)
    return response
}

const updateMovement = async (movement) => {
    const newUrl = url + `updateMovement/${movement.id}`
    const options = {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movement)
    }
    const response = await fetch(newUrl, options)
    return response
}

const deleteMovement = async (id) => {
    const newUrl = url + `deleteMovement/${id}`
    await fetch(newUrl, { method: 'delete'})
    loadMovements()
}

async function postMovements(method, form, id) {
    const data = new FormData(form)
    const objData = {
        description: data.get('description'),
        amount: data.get('amount'),
        type: data.get('type')
    }

    if(!validarCampos(objData)) return

    let response;
    if(method === 'post') {
        response = await addMovements(objData)
    } else if (method === 'put') {
        objData.id = id
        response = await updateMovement(objData)
    }
    if (!response.ok) alert("Ocorreu um error, code: " + response.status)
    loadMovements()
}

function validarCampos(movement) {
    if(!movement.description || !movement.amount || !movement.type) {
        alert('Insira os dados corretamente')
        return false
    }
    if(movement.description.value > 50 || movement.amount.value > 100000000) {
        alert('Respeite o máxima de caracteres permitos nos campos')
        return false
    }
    return true
}

function removeMovement({ id }) {
    if(!confirm("Tem certeza que deseja deletar?")) return
    deleteMovement(id)
}

function createElement({ element, text = '', classes = '' }) {
    const ele = document.createElement(element)
    ele.innerText = text
    if (!!classes) classes.forEach(e => ele.classList.add(e));
    return ele
}

function craeteActionButton(type) {
    const button = createElement({
        element: 'button',
        classes: ['btn-action', `btn-${type}`]
    })
    button.innerHTML = `<span class="material-symbols-outlined">${type}</span>`
    return button
}

function removeElement(element) {
    element.remove()
}

function createEditForm(movement) {
    const section = createElement({element: 'section', classes: ['cont-edit-form']})
    const newForm = formAddMovement.cloneNode(true)

    newForm.classList.remove('form-add-movement')
    newForm.classList.add('form-edit-movement')
    newForm.removeChild(newForm.querySelector('button'))

    const h1 = createElement({element: 'h1', text: 'Editar movemento'})
    const divButtons = createElement({element: 'div', classes: ['buttons']})
    const buttonCancel = createElement(
        {element: 'button', text: 'Cancelar',classes: ['btn-cancel-movement']}
    )
    const buttonEdit = createElement(
        {element: 'button', text: 'Adicionar',classes: ['btn-edit-movement']}
    )

    buttonCancel.addEventListener('click', () => removeElement(section))
    buttonCancel.setAttribute('type', 'button')

    const inputDescript = newForm.querySelector('input[name=description]')
    inputDescript.value = movement.description
    const inputAmount = newForm.querySelector('input[name=amount]')
    inputAmount.value = movement.amount
    const select = newForm.querySelector('select')
    select.value = movement.type


    divButtons.appendChild(buttonCancel)
    divButtons.appendChild(buttonEdit)

    newForm.appendChild(divButtons)

    section.appendChild(h1)
    section.appendChild(newForm)
    
    main.appendChild(section)
    newForm.addEventListener('submit', (e) => {
        e.preventDefault()
        postMovements('put', newForm, movement.id)
        removeElement(section)
    })
}

function createRow(movement) {
    const tableClass = movement.type === 'saida' ? 'movement-spent' : 'movement-gain'
    const tdAmountClass = movement.type === 'saida' ? 'td-spent' : 'td-gain'
    const dateShort = new Date(movement.create_time)
        .toLocaleString('pt-br', { dateStyle: 'short' })
    const amountConverted = movement.amount
        .toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
    
    const tableRow = createElement({ element: 'tr', classes: [tableClass] })

    const tdId = createElement({element: 'td', text: movement.id})
    const tdDescription = createElement({ element: 'td', text: movement.description })
    const tdCreatedDate = createElement({ element: 'td', text: dateShort })
    const tdType = createElement({ element: 'td', text: movement.type })
    const tdAmount = createElement({ element: 'td', text: amountConverted, classes: ['td-amount', tdAmountClass]})
    tdAmount.setAttribute('movement-amount', movement.amount)
    const tdAction = createElement({ element: 'td', classes: ['td-actions'] })

    const btnEdit = craeteActionButton('edit', movement)
    const btnDelete = craeteActionButton('delete', movement)

    btnEdit.addEventListener('click', () => createEditForm(movement))
    btnDelete.addEventListener('click', () => removeMovement(movement))

    tdAction.appendChild(btnEdit)
    tdAction.appendChild(btnDelete)

    tableRow.appendChild(tdId)
    tableRow.appendChild(tdDescription)
    tableRow.appendChild(tdCreatedDate)
    tableRow.appendChild(tdType)
    tableRow.appendChild(tdAmount)
    tableRow.appendChild(tdAction)

    return tableRow
}

formAddMovement.addEventListener('submit', async (e) => {
    e.preventDefault()
    postMovements('post', formAddMovement)
})

async function loadMovements() {
    formInputs.forEach(e => {
        e.value = ''
    })
    tableBody.innerHTML = ''
    const movements = await getAllMovements()
    movements.forEach(mov => {
        const newRow = createRow(mov)
        tableBody.appendChild(newRow)
    })
    initCalcs()
}

loadMovements()