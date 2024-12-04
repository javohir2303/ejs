const express = require("express")
const cors = require("cors")
const path = require("node:path")
const {Repository} = require("./lib/repository")
const {ResData} = require("./lib/resData")
const {RegistorUser} = require("./lib/registorUser")
const {CarCreate} = require("./lib/carCreate")
const session = require('express-session');


const userPath = path.resolve("database", "users.json")
const userRepository = new Repository(userPath)
const carPath = path.resolve("database", "cars.json")
const carRepository = new Repository(carPath)




const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "../views"))
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res)=>{
    res.render("index.ejs")
})

app.get("/login", (req, res)=>{
    res.render("login.ejs")
})

app.post("/login", async (req, res)=>{
    const { login_username = "", login_password = "" } = req.body
    const read = await userRepository.read()

    const findUsername = read.find((el)=>{
        return el.username === login_username
    })
    const findPassword = read.find((el)=>{
        return el.password === login_password
    })


    if (findUsername && findPassword) {  
        res.render("index.ejs", {
            login_username,
            login_password,
            car: req.session.car,
            price: req.session.price,
            year: req.session.year,
            email: req.session.email,
            username: req.session.username,
            password: req.session.password,
            confrim_password: req.session.confrim_password,
        });
    } else {
        res.render("login.ejs", {massage : "please sign-up"})
    }
})

app.get("/registor", (req, res)=>{
    res.render("registor.ejs")
})
app.post("/registor", async (req, res)=>{
    const {email = "", username = "", password = "", confrim_password = "" } = req.body
    const user = new RegistorUser(email, username, password, confrim_password)
    await userRepository.read()

    if (password === confrim_password) {
        await userRepository.writeAdd(user)
        res.render("index.ejs", {
            email,
            username,
            password,
            confrim_password,
            car: req.session.car,
            price: req.session.price,
            year: req.session.year,
            login_username : req.session.login_username,
            login_password: req.session.login_password 
        });
    } else {
        res.render("registor.ejs", {massage : "confirm password error"})
    }
})  

app.get("/car-create", (req, res)=>{
    res.render("carCreate.ejs")
})

app.post("/car-create", async (req, res) => {
    const { car = "", price = "", year = "" } = req.body;
    const carData = new CarCreate(car, price, year);
    await carRepository.writeAdd(carData);
    res.render("index.ejs", {
        car,
        price,
        year,
        email: req.session.email,
        username: req.session.username,
        password: req.session.password,
        confrim_password: req.session.confrim_password,
        login_username : req.session.login_username,
        login_password: req.session.login_password
    });
});






app.listen(7777, ()=>{
    console.log("server ishga tushdi....");
})