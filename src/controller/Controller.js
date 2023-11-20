import { Seat, Row, Section, Venue} from '../model/Model.js'

export function createVenueC(name, leftR, leftC, rightR, rightC, centerR, centerC){
    console.log(name);
    console.log(leftR);
    console.log(leftC);
    console.log(rightR);
    console.log(rightC);
    console.log(centerR);
    console.log(centerC);
}

export function deleteVenueC(){
    console.log("Deleted venue");
}

export function createShowC(name, date, time){
    console.log(name);
    console.log(date);
    console.log(time);
}