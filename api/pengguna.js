// Mengendalikan HTTP request
const express = require('express');
const router = express.Router();

// Menyediakan algoritma penyulitan
const bcrypt = require('bcryptjs');

// Model data pengguna
const Pengguna = require('../model/Pengguna');

// Mengendalikan kesahan dan kebenaran (authentication and authorization) pengguna
const pengesahan = require('../middleware/pengesahanToken')

// Import fungsi-fungsi kemudahan
const deleteUndefinedProps = require('../util/deleteUndefinedProps');

// Membuat hubungan dengan pangkalan data
require('../konfig/pangkalan_data').connect(); 

/*  GET semua pelanggan

*/
router.get('/semua', async (req, res) => {
    const koleksi = await Pengguna.find({});
    res.status(200).send(koleksi);
});

/*  GET pelanggan

*/
router.get('/maklumat_pengguna', pengesahan, async (req, res) => {
    try {
        // Dapatkan params dan maklumat pengguna
        const { _id } = req.pengguna;

        // Mendapatkan keseluruhan maklumat pengguna
        const maklumatPengguna = await Pengguna.findById(_id);

        return res.status(200).json(maklumatPengguna);
    } catch (err) {
        // Ralat berlaku
        console.log(err);
    }
});


/*  PUT (kemas kini) pelanggan

*/
router.put('/kemas_kini', pengesahan, async (req, res) => {
    try {
        const { _id } = req.pengguna;

        // Mencari pengguna
        const pengguna = await Pengguna.findById({ _id });

        // Memastikan pengguna wujud
        if (!pengguna) {
            return res.status(403).send({ mesej: 'Pengguna tidak wujud' });
        }

        const { nama, kata_laluan_lama, kata_laluan_baharu } = req.body;

        // Jika pengguna ingin mengemaskini KATA LALUAN...
        // Menguji jika parameter kata laluan lama diberi
        if (kata_laluan_baharu) {

            // Memastikan kesahan kata laluan lama
            if (!(await bcrypt.compare(kata_laluan_lama ? kata_laluan_lama : '', pengguna.kata_laluan))) {
                return res.status(400).send({ mesej: 'Kata laluan salah' });
            }

            // Menyulitkan kata laluan
            const kataLaluanDisulit = await bcrypt.hash(kata_laluan_baharu, 10);

            // Mengemaskini kata laluan pengguna
            pengguna.kata_laluan = kataLaluanDisulit;
        }

        // Memastikan nama diberikan
        if (!nama) {
            return res.status(400).send({ mesej: 'Nama diperlukan' });
        }

        // Mengemaskini nama pengguna
        pengguna.nama = nama;

        // Menyimpan maklumat dalam pangkalan data
        pengguna.save();

        res.status(400).send(pengguna)
    } catch (err) {
        console.log(err);
    }
});

// Mengeksport router untuk digunakan oleh aplikasi
module.exports = router;