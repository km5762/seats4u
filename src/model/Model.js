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
}