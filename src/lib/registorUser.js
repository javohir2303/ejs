const uuid = require("uuid")

class RegistorUser {
    constructor(email, user, pass, confirmPassword){
        this.id = uuid.v4()
        this.email = email
        this.username = user
        this.password = pass
        this.confirmPassword = confirmPassword
    }
}

module.exports = {RegistorUser}