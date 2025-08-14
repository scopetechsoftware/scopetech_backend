const mongoose = require('mongoose')


const eventschema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    src:{
        type:String
    },
    description:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("events",eventschema)