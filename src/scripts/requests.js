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

//function to find the description of completed requests, called during the map while creating html
const findDescription = (completion) => {
    const requests = getRequests()
    let matchedRequest = requests.find(request => {return request.id === completion.requestId})
    return matchedRequest.description
}

//function to hide descriptions if they've already been completed
const shouldIHide = (request) => {
    const completions = getCompletions()
    for (const completion of completions) {
        if(completion.requestId === request.id){
            return "hide"
        }
    }
    return "show"
}

//generates html for requests
export const requestsHtml = () => {
    const requests = getRequests()
    const completions = getCompletions()

    let html = `
        <ul>
            ${
                requests.map(request => {
                    return `<li class="${shouldIHide(request)}">${request.description}
                    <select class="plumbers" id="plumbers">
                    <option value="">Choose</option>
                    ${plumbersMap(request)}
                    </select>
                    <button id="request--${request.id}">Delete</button></li>`
                }).join("")
            }
            ${
                completions.map(completion => {

                    return `<li class="completion">${findDescription(completion)} (Completed by ${findPlumber(completion)})</li>`
                }).join("")
            }
        </ul>
    `

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
                id: requests.length + 1,
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