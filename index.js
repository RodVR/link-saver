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
     // Use Chrome Tabs API to get the active tab's URL.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Add the active tab's URL to "myLeads" array        
        myLeads.push(tabs[0].url)
        // Save the updated "myLeads" array to local storage
        localStorage.setItem('myLeads', JSON.stringify(myLeads))
        renderLeads()
    })
})


buttonEl.addEventListener('click', function () {
    /* .value is a standard property of an HTML <input> element.
       It's used to retrieve the current text entered by the user 
       in the <input> field 
    */
    const inputValue = inputEl.value.trim()
    // Check if input field is not empty
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
        // data-* is a custom data attribute in HTML
        // after data- it can be whatever you want, it could've been data-banana, for example
        // it's used to store the index of each lead in the array, in this example
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

    // Add functionality to every "Copy" button with querySelectorAll
    const copyButtons = document.querySelectorAll('.copy-lead')
    copyButtons.forEach((button) => {
        button.addEventListener('click', function () {
            // In event listeners, "this" refers to the element that received the event.   
            // So, index is gonna be the index in the "data-" attribute 
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
    // Get the lead (URL) from the myLeads array based on the provided index
    const lead = myLeads[index]
    // Copy the lead to the clipboard using the Clipboard API
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
