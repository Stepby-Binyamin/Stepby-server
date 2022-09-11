const mongoose = require("mongoose")

// const MONGO_URL = `mongodb+srv://stepby:Stepby123@cluster0.onb7tvx.mongodb.net/stepby?retryWrites=true&w=majority`
const MONGO_URL = process.env.MONGO_URL

const connect = async () => {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
            if (error) throw error
            console.log(`Connection Success, State`, mongoose.connection.readyState);
        })
    } catch (error) {
        console.log(`Error Mongoose`, error.message)
    }
}

module.exports = { connect }