require('dotenv').config();
const mongoose =  require("mongoose");

try {
  mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false 
  });
} catch(error) {
  error => console.log(`error in DB connection ${err}`)
}

module.exports = mongoose;