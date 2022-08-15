const API = "http://localhost:8088"

export const fetchRequests = () => {
    return fetch(`${API}/requests`)
        .then(response => response.json())
        .then(
            (serviceRequests) => {
                // Store the external state in application state
                for (const request of serviceRequests) {
                    request.completed = false
                    for (const completion of applicationState.completions) {
                        if(request.id === completion.requestId){
                            request.completed = true
                        }
                    }
                }
                let newRequests = serviceRequests.sort((a,b) => {
                    return a.completed - b.completed
                })
                applicationState.requests = newRequests
            }
        )
}
//sets up temporary state
const applicationState = {
    requests: [],
    plumbers: [],
    completions: []
}

//export requests to other modules
export const getRequests = () => {
    return structuredClone(applicationState.requests)
}


//establish mainContainer
const mainContainer = document.querySelector("#container")

//called when the button is clicked, is passed the temporary state object to post to json api db
export const sendRequest = (userServiceRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userServiceRequest)
    }


    return fetch(`${API}/requests`, fetchOptions)
        .then(response => response.json())
        .then(() => {
            mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
        })
}

//DELETE records
export const deleteRequest = (id) => {
    return fetch(`${API}/requests/${id}`, { method: "DELETE" })
        .then(
            () => {
                mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
            }
        )
}

//api call to get plumbers
export const fetchPlumbers = () => {
    return fetch(`${API}/plumbers`)
        .then(response => response.json())
        .then(
            (data) => {
                applicationState.plumbers = data
            }
        )
}

//get plumbers
export const getPlumbers = () => {
    fetchPlumbers()
    return structuredClone(applicationState.plumbers)
}


//save completions when the select is clicked
export const saveCompletions = (completion) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(completion)
    }


    return fetch(`${API}/completions`, fetchOptions)
        .then(response => response.json())
        .then(() => {
            mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
        })
    }

//api call to fetch completions
export const fetchCompletions = () => {
    return fetch(`${API}/completions`)
    .then(response => response.json())
    .then(
        (data) => {
            applicationState.completions = data
        }
    )
}

//export completions
export const getCompletions = () => {
    fetchCompletions()
    return structuredClone(applicationState.completions)
}