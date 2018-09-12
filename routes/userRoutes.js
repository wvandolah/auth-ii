const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database/dbConfig");
const secret = "some lotr q";

function genToken(user){
    const payload = {
        username: user.username,
        department: user.department
    }
    const options = {
        expiresIn: "1h"
    }
    return jwt.sign(payload, secret, options)
}


router.get("/", (req, res) => {
    res.send("router working")
})

router.post("/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;

    db("users")
        .insert(creds)
        .then(ids => {
            const id = ids[0];
            // console.log(id)
            db("users")
                .where({id})
                .first()
                .then(user => {
                    const token = genToken(user)
                    res.status(201).json({token})
                }).catch(err => res.status(500).json({errorToken: err}))
        }).catch(err => res.status(500).json({errorRegister: err}))
})

module.exports = router;