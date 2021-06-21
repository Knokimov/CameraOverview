const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    id: {
        type:Number
    },
    stedsnavn: {
        type:String
    },
    veg: {
        type:String
    },
    landsdel: {
        type:String
    },
    vaervarsel: {
        type:String
    },
    info: {
        type:String   
    },
    fylkesnummer: {
        type:String
    },
    maalestasjonsnummer: {
        type:String
    },
    videoformat: {
        type:String
    },
    videoUrl:
    {
        type:String
    },
    videobeskrivelse:
    {
        type:String
    },
    bildefrekvens:
    {
        type:String
    },
    lengdegrad:
    {
        type:Number
    },
    breddegrad: {
        type:Number
    }
}, {
    timestamps: false
});

const Data = mongoose.model('Data', DataSchema);
module.exports = Data;