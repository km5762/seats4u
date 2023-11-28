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