const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true
}

const user_schema = new mongoose.Schema({
    _id: reqString,
    username: reqString,
    discriminator: reqString,
    avatar: String,
    bot: Boolean,
    messageCount: Number,
    exp: Number,
    level: Number,
    prefences: {
        language: String,
        timezone: String,
        dm: Boolean,
    },
})

module.exports = mongoose.model("User", user_schema);