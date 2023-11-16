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
    constructor(name, date, active, block_layout){
        this.name = name
        this.date = date
        this.active = active
        this.block_layout = block_layout
    }
}

export class Venue {
    constructor(name, show, layout){
        this.name = name
        this.show = show
        this.layout = layout
    }
}