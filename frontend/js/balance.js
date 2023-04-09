export function initCalcs() {
    const balance = document.querySelector('.balance')
    const spent = document.querySelector('.spent')
    const gain = document.querySelector('.gain')
    
    function calcAmounts() {
        const amounts = document.querySelectorAll('.table-movements .td-amount')
        let spents = []
        let gain = []

        amounts.forEach(amount => {
            const amountParsed = Number(amount.getAttribute('movement-amount'))
            if(amount.classList.contains('td-gain')) {
                gain.push(amountParsed)
            } else if (amount.classList.contains('td-spent')) {
                spents.push(amountParsed)
            }
        })
        spents = spents.reduce((acl, atl) => acl + atl, 0)
        gain = gain.reduce((acl, atl) => acl + atl, 0)

        return {spents, gain}
    }

    const calcTotal = (gain, spent) => gain - spent

    const convertMonetary = (value) => { 
        return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
    }

    function init() {
        const amountSpent = calcAmounts().spents
        const amountGain = calcAmounts().gain
        spent.innerText = convertMonetary(amountSpent)
        gain.innerText = convertMonetary(amountGain)

        const total = calcTotal(amountGain, amountSpent)

        if(total > 0) {
            balance.classList.add('balance-positive')
        } else {
            balance.classList.remove('balance-positive')
        }
        
        balance.innerText = convertMonetary(total)
    }

    init()
}