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
        console.error("Error occurred during creating venue:", error);
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
        console.log(data);
    } catch (error) {
        console.error("Error occurred during deleting venue:", error);
    }

    manager.deleteVenue();
}


export async function deleteShowC(manager, showToDelete) {
    try {
        const res = await fetch(
            "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/deleteevent",
            {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(showToDelete),
            }
        );

        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Error occurred during deleting show:", error);
    }

    manager.venue.deleteShow(showToDelete);
}

export async function createShowC(manager, name, date, time) {
    manager.venue.addShow(name, date, time);

    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100);
    const day = date % 100;

    const hours = Math.floor(time / 100);
    const minutes = time % 100;

    const isoDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const isoDate = new Date(isoDateString);

    try {
        const res = await fetch(
            "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/createevent",
            {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    venueId: manager.id,
                    date: isoDate.toISOString(), //sends the date UTC
                }),
            }
        );

        const data = await res.json();
        console.log(data.eventId);
        manager.addShowId(data.eventId);

    } catch (error) {
        console.error("Error occurred during creating a show:", error);
    }
}

export async function activateShowC(showToActivate) {
    try {
        const res = await fetch(
            "https://4r6n1ud949.execute-api.us-east-2.amazonaws.com/activateevent",
            {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(showToActivate),
            }
        );

        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Error occurred while activating show:", error);
    }
}