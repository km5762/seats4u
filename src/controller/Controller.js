import { Seat, Row, Section, Venue} from '../model/Model.js'
import { post } from "./Api"

export function createVenueC(manager, name, leftR, leftC, rightR, rightC, centerR, centerC){
    manager.createVenue(name);
}

export function deleteVenueC(manager){
    manager.deleteVenue();
}

export function createShowC(manager, name, date, time){
    manager.venue.addShow(name, date, time);
    console.log(manager);
}

export function listVenuesC(admin){
    // potentially modify the model
    let nameField = document.getElementById("venues")

     // prepare payload for the post
    let data = { 'name': nameField.value }
 
    const handler = (json) => {
        console.log(json)
        // clear inputs
        nameField.value = ''
    }

    post('/listvenues', data, handler)}