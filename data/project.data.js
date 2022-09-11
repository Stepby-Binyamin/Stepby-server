const mongoose = require("mongoose");
require("./user.data")
require("./category.data")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    client: {  
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    isTemplate: {
        type: Boolean,
        default: false,
        required: true,
    },
    categories:[{type: mongoose.SchemaTypes.ObjectId,
        ref: 'categories'}],
    status: {
        type: String,
        enum:['done', 'biz', 'client' , 'new' ] 
    },
    lastApprove: { 
        type: Date, 
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    steps: [{ 
            index:{ 
            type:Number ,
            required: true,
        },
        isCreatorApprove:{   
            type: Boolean
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isApprove:{
            type: Boolean,
        },
        approvedDate:{
            type: Date, 
        },
        isActive: {
            type: Boolean,
            default: true,
        }
        data: [{
            owner: { 
                type: String,
                enum:['biz', 'client' ] 
            },
            type: { 
                type: String,
                enum:['pdf',  'img' , 'file' , 'answer'] 
            },
            title: { 
                type: String,
            },
            content: { 
                type: String,
            },
            index:{ 
                type:Number 
            },
            isRequired:{
                type:Boolean,
                default:true
            }
        }]
    }],
});

const projectData = mongoose.model("project", projectSchema);
module.exports = { projectData };