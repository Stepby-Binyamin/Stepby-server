const  mongoose = require ('mongoose');

//TODO: need to check whether to add 'fullName' field (for the user-client).
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    bizName: { //each user can have only one businesse
        type: String,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    categories: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
    },
    permissions: {
        type: String,
        enum: ["biz", "client", "admin"]
    },
    project: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
    }],
    createDate: {
        type: Date,
        default: Date.now,
      },
    isActive:{
        type: Boolean,
        default: true
    },
    lastLog: {
        type: Date,
    }
});

const userData = mongoose.model("user",userSchema);


module.exports = {userData};

