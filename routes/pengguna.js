const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const { readFileSync } = require('fs');

// Pendirian pangkalan data
const url = `mongodb+srv://iNFiENiTE:${require('../‎')}@infienite-cluster.4j1az.mongodb.net/urusmarkah?retryWrites=true&w=majority`;
const pangkalan_data = new MongoClient(url);

// Menyambung hubungan dengan pangkalan data
const hubunganPangkalanData = async (req, res, next) => {
    try {
        await pangkalan_data.connect();
        console.log("Hubungan berjaya!")
        await next();
    }
    catch (err) {
        console.log(err.stack)
    }
};

// Penetapan middleware
router.use(hubunganPangkalanData);
router.use(express.urlencoded());

// Dapatkan halaman borang
router.get("/", (req, res) => {
    res.writeHead(200, {"Content-Type":"text/html"});
    const borang = readFileSync("../client/borang.html");
    res.write(borang);
    res.end();
});

// Cipta akaun pengguna baharu
router.post("/", (req, res) => {
    const koleksi = pangkalan_data.db().collection("pengguna");
    const maklumatAkaunBaharu = { emel: req.body.emel, nama: req.body.nama }
    koleksi.insertOne(maklumatAkaunBaharu);
    res.end();
});

module.exports = router;