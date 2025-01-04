let myLeads = []

const buttonEl = document.querySelector('#input-btn')
const inputEl = document.querySelector('#input-el')
const ulEl = document.getElementById('ul-el')
const deleteBtn = document.getElementById('delete-btn')
const alertMsgEl = document.getElementById('alert-msg')
const tabBtn = document.getElementById('tab-btn')


// Retrieve leads from local storage and parse them into an array so I can use array methods again
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'))

// If there are leads in local storage, assign them to myLeads and render them
if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    renderLeads()
}

tabBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url)
        localStorage.setItem('myLeads', JSON.stringify(myLeads))
        renderLeads()
    })
})


buttonEl.addEventListener('click', function () {
    const inputValue = inputEl.value.trim()
    if(inputValue){
        myLeads.push(inputEl.value)
        // Clear the input field
        inputEl.value = ""
        // Convert the myLeads array to a string and save it in the browser's local storage
        localStorage.setItem('myLeads', JSON.stringify(myLeads))
        renderLeads()
    } else {
        alertMsgEl.textContent = "Input field cannot be empty"
    }
})


function renderLeads() {
    let listItems = ""

    for (let i = 0; i < myLeads.length; i++) {
        listItems +=
            `<li>
                <a target="_blank" href="${myLeads[i]}">
                    ${myLeads[i]}
                </a>
                <button class="copy-lead" data-index="${i}">Copy</button>
                <button class="delete-lead" data-index="${i}">Delete</button>
            </li>`
    }

    ulEl.innerHTML = listItems

    const copyButtons = document.querySelectorAll('.copy-lead')
    copyButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index')
            copyLead(index)
        })

        button.style.width = "20px"
        button.style.height = "auto"
        button.style.fontSize = "10px"
        button.style.display = "inline-flex"
        button.style.alignItems = "center"
        button.style.justifyContent = "center"
        
    })

    const deleteButtons = document.querySelectorAll('.delete-lead')
    deleteButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index')
            removeLead(index)
        })

        button.style.width = "20px"
        button.style.height = "auto"
        button.style.fontSize = "10px"
        button.style.display = "inline-flex"
        button.style.alignItems = "center"
        button.style.justifyContent = "center"
    })

}

function copyLead(index){
    const lead = myLeads[index]
    navigator.clipboard.writeText(lead)
}

function removeLead(index) {
    myLeads.splice(index, 1)
    localStorage.setItem('myLeads', JSON.stringify(myLeads))
    renderLeads()
}


deleteBtn.addEventListener('click', function () {
    localStorage.clear()
    myLeads = []
    renderLeads()
})
