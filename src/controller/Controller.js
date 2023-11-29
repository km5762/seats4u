import { Seat, Row, Section, Venue} from '../model/Model.js'

export async function createVenueC(manager, name, leftR, leftC, rightR, rightC, centerR, centerC){
    
    try {
        const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createvenue",
        {
            credentials: "include",
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "name": name, 
                "sections": [{"rowCount": leftR, "colCount": leftC}, 
                            {"rowCount": centerR, "colCount": centerC},
                            {"rowCount": rightR, "colCount": rightC}]}),
        }
        );

        const data = await res.json();
        console.log(data.venueId)
        manager.addId(data.venueId)
    } catch (error) {
        console.error("Error occurred during login:", error);
    }


    manager.createVenue(name);
}

export async function deleteVenueC(manager){

    try {
        const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/deletevenue",
        {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ venueId: manager.id }),
        }
        );

        const data = await res.json();
        console.log(data)
    } catch (error) {
        console.error("Error occurred during login:", error);
    }

    manager.deleteVenue();
}

export async function createShowC(manager, name, date, time){
    manager.venue.addShow(name, date, time);
    console.log(manager);

    try {
        const res = await fetch(
        "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createevent",
        {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "name": name, 
                "venueId": manager.id,
                "date": date
            }),
        }
        );

        // const data = await res.json();
        // console.log(data.insertId)
    } catch (error) {
        console.error("Error occurred during login:", error);
    }

}