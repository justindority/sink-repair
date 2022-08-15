import { getRequests, deleteRequest, fetchPlumbers, getPlumbers, getCompletions, saveCompletions } from "./dataAccess.js"


//function to create the html for plumbers (was having issues doing this inside the code itself)
const plumbersMap = (request) => {
    const plumbers = getPlumbers()
    return plumbers.map(plumber => {
        return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
    }).join("")
}

//find the name of the plumber that completed the request
const findPlumber = (completion) => {
    const plumbers = getPlumbers()
    let matchedPlumber = plumbers.find(plumber => {return plumber.id === completion.plumberId})
    return matchedPlumber.name
}


//function to hide descriptions if they've already been completed
const findCompletion = (request) => {
    const completions = getCompletions()
    let foundCompletion = completions.find(completion => {return completion.requestId === request.id})
    return foundCompletion
}

//generates html for requests
export const requestsHtml = () => {
    const requests = getRequests()
    const completions = getCompletions()
    let completed = false


    let html = `
        <ul>
            ${
                requests.map(request => {
                    let foundCompletion = findCompletion(request)
                    if(foundCompletion){
                        return `<li class="completion">${request.description} (Completed by ${findPlumber(foundCompletion)})</li>`
                    } else {
                        return `<li class="request">${request.description}
                    <select class="plumbers" id="plumbers">
                    <option value="">Choose</option>
                    ${plumbersMap(request)}
                    </select>
                    <button id="request--${request.id}">Delete</button></li>`
                }}).join("")
                    }

        </ul>`

    return html
}



const mainContainer = document.querySelector("#container")

//click event for deleting requests
mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [,requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})



//click event listener for completions - creates a new completion in the db for the chosen request
mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")
            const requests = getRequests()

            let completionObject = {
                requestId: parseInt(requestId),
                plumberId: parseInt(plumberId),
                date_created: Date.now()
            }
            /*
                    This object should have 3 properties
                    1. requestId
                    2. plumberId
                    3. date_created
            */
            saveCompletions(completionObject)

        }
    }
)