const { Schema, model } = require('mongoose');

const skemaPengiraan = new Schema({
    nama: { type: String, required: true, unique: true },
    noRujukan: { type: Number, required: true }
});

module.exports = model('pengiraan', skemaPengiraan, 'pengiraan');