const uuid = require("uuid")

class CarCreate {
    constructor(name, price, year){
        this.id = uuid.v4()
        this.name = name
        this.price = price
        this.year = year
    }
}

module.exports = { CarCreate }