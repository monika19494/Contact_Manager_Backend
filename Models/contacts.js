const mongoose = require("mongoose");
const contactsSchema = new mongoose.Schema({
    name: {type:String},
    designation: {type:String},
    company:{type:String},
    industry:{type:String},
    email: {type:String},
    phoneNumber:{type:String},
    country:{type:String},
    userId: { type: String, ref: "User" }
});

const contactsModel = new mongoose.model("contacts", contactsSchema);
module.exports = contactsModel;