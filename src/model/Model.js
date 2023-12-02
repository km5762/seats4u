export class Seat {
    constructor(available){
        this.available = available
    }
}

export class Row {
    constructor(seats){
        this.seats = seats
    }
}

export class Section {
    constructor(rows){
        this.rows = rows
    }
}

export class Block {
    constructor(rows, price){
        this.rows = rows
        this.price = price
    }
}

export class Show {
    // constructor(name, date, active, block_layout){
    //     this.name = name
    //     this.date = date
    //     this.active = active
    //     this.block_layout = block_layout
    // }
    constructor(name, date, time){
        this.name = name
        this.date = date
        this.time = time
    }
}

export class Venue {
    // constructor(name, shows, layout){
    //     this.name = name
    //     this.shows = shows
    //     this.layout = layout
    // }

    constructor(name){
        this.name = name
        this.shows = []
    }

    addShow(name, date, time){
        let show = new Show(name, date, time);
        this.shows.push(show);
    }

    deleteShow(showToDelete) {
        const initialShowCount = this.shows.length;
        this.shows = this.shows.filter(show => {
            return !(show.name === showToDelete.name && 
                     show.date === showToDelete.date && 
                     show.time === showToDelete.time);
        });
    
        const deletedShowCount = initialShowCount - this.shows.length;
        if (deletedShowCount > 0) {
            console.log(`Deleted show: Name '${showToDelete.name}', Date '${showToDelete.date}', Time '${showToDelete.time}'.`);
        } else {
            console.log(`No matching show found for deletion.`);
        }
    }              //Use find()??
}

export class VenueManager {

    constructor(){
        this.venue = null;
    }

    createVenue(name){
        let venue = new Venue(name);
        this.venue = venue;
    }

    deleteVenue(){
        this.venue = null
    }

    addId(id){
        this.id = id;
    }
}

export class Administrator{

    constructor(){

        this.venues = [];
        // this.v1 = new Venue("v1");
        // this.v2 = new Venue("v2");
        // this.v3 = new Venue("v3");

        // this.v1.addShow("random", "122523", "1800");
        // this.v1.addShow("random2", "122523", "1800");
        // this.v1.addShow("random3", "122523", "1800");
        // this.v2.addShow("random4", "122523", "1800");

        // this.venues = [this.v1, this.v2, this.v3];
    }

    addVenue(name){
        let venue = new Venue(name);
        this.venues.push(venue);
    }
}