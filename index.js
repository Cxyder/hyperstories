const express = require('express')
const app = express()

app.set("views", (__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static((__dirname, "public")));

process.on("uncaughtException", (err) => console.log(err))
process.on("unhandledRejection", (err) => console.log(err))

const port = 80
let gameon = false
let gameS = 320
let connected = []
let connectionhandl =[]
let newroundusers = []
let soundtrackID = 0//Math.floor(Math.random() * (3 - 1 + 1) + 1)
let turncount = 0

let totalis = ""
let usermap = {
    p0: {
        username: "",
        words: [""],
    },
    p1: {
        username: "",
        words: [""],
    },
    p2: {
        username: "",
        words: [""],
    },
    p3: {
        username: "",
        words: [""],
    },
    p4: {
        username: "",
        words: [""],
    },
    p5: {
        username: "",
        words: [""],
    },
    p6: {
        username: "",
        words: [""],
    },
    p7: {
        username: "",
        words: [""],
    },
    p8: {
        username: "",
        words: [""],
    },
    p9: {
        username: "",
        words: [""],
    },
}


app.get('/', (req, res) => {
    res.render("mainmenu.pug")
    //res.render("welcome.pug")
})

app.get("/privategame", (req, res) => {
    let username = req.query.usr
    res.render("privategame.pug", {
        username: username
    })
})

app.get("/newjoin", (req, res) => {
    if (!gameon) {
        if(connected.length >= 2) {
            turncount = Math.floor(Math.random() * (connected.length - 0 + 0) + 0)
            gameon = "play"
            soundtrackID = Math.floor(Math.random() * (3 - 1 + 1) + 1)
            setTimeout(gameTimer, 1000)
        }
    }

    let username = req.query.usr
    if (connected.length < 10) {
        if(!connected.includes(username)) {
            connected.push(username)
            if(!connectionhandl.includes(username)) {
                connectionhandl.push(username)
            }
        } else {
            if(!connectionhandl.includes(username)) {
                connectionhandl.push(username)
            }
        }
        res.send(connected)
    }
})
app.get("/submit", (req, res) => {
    let username = req.query.usr
    if(!connected[turncount] == username) return res.send("FAILED")
    let word = req.query.word.split(" ").pop()
    //Add space
    word = word + " "
    //let owords = usermap[turncount].words

    totalis = totalis + word

    //usermap[turncount] = {
    //    username: username,
    //    words: [word, owords]
    //}
    
    turncount++
    if(turncount >= connected.length) turncount = 0
    res.send("OK")
})
app.get("/infoDispatcher", (req,res) => {
    if(turncount > connected.length) turncount = connected.length
    let responseJSON = {
        status: "OK",
        totalis: totalis,
        gameon: gameon,
        gametimer: gameS,
        turncount: turncount,
        turnplayer: connected[turncount],
        playercount: connected.length,
        nextroundclicks: newroundusers.length,
        soundtrackid: soundtrackID,
    }
    
    res.send(responseJSON)
})

app.get("/playercount", (req,res) => {
    res.send(connected.length)
})

app.get("/newroundrequest", (req,res) => {
    let username = req.query.usr
    if(!newroundusers.includes(username)) newroundusers.push(username)

    //If all players agree, start a new round
    if(newroundusers.length >= connected.length) {
        totalis = ""
        turncount = Math.floor(Math.random() * (connected.length - 0 + 0) + 0)
        gameS = 320
        gameon = "play"
        newroundusers = []
        soundtrackID = Math.floor(Math.random() * (3 - 1 + 1) + 1)
        setTimeout(gameTimer, 1000)
    }

    res.send("Requested")
})
//Game functions
function gameTimer() {
    for (let i = 1; i <= 320; i++) {
        let ms = i * 1000
        setTimeout(() => {
            gameS--
            if(gameS <= 0) {
                gameon = "end"
            }
        }, ms)
    }
}

//Connection Handling for the endless game
setInterval(() => {
    if (connectionhandl < connected) {
        let ovrwrt = []
        connected.forEach((e) => {
            if(connectionhandl.includes(e)) {
                ovrwrt.push(e)
            }
            connected = ovrwrt
        })
    }
    connectionhandl.length = 0
}, 3000)

app.listen(port, () => {
  console.log(`Gioco Avviato  -  http://localhost:${port}`)
})
