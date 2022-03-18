const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const state_schema = new mongoose.Schema({
    _id: reqString,
    ipv4: String,
    ipv6: String,
    discordjs_version: reqString,
    nodejs: reqString,
    mongodb: reqString,
    cpuArch: String,
    cpu: String,
    os: String,
    timeIstanbul: reqString,
})

module.exports = mongoose.model("States", state_schema);