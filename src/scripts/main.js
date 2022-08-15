import { SinkRepair } from "./SinkRepair.js"
import { fetchRequests, fetchPlumbers, fetchCompletions } from "./dataAccess.js"


const mainContainer = document.querySelector("#container")

const render = () => {
    fetchCompletions()

    .then(() => fetchPlumbers())
    .then(() => fetchRequests())
    .then(
        () => {
            mainContainer.innerHTML = SinkRepair()
        }
    )
}

mainContainer.addEventListener(
    "stateChanged",
    customEvent => {
        render()
    }
)

render()

