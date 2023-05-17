const  mongoose = require ('mongoose');
//TODO: add required for category/project/user??
const userSchema = new mongoose.Schema({
    firstName: { // for biz
        type: String,
    },
    lastName: { // for biz
        type: String,
    },
    fullName: { // for client
        type: String, 
    },
    email: {
        type: String,
    },
    bizName: {   //for biz
        type: String,
    },
    bizId:{   // for client
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    }],
    permissions: {
        type: String,
        enum: ["biz", "client", "admin"],
        require: true
    },
    project: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
    }],
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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
userSchema.index({
    phoneNumber: 1,
    permissions: 1,
    bizId:1
  }, 
  { unique: true });
const userData = mongoose.model("user",userSchema);
module.exports = {userData};