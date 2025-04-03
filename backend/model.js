import mongoose from 'mongoose'

const paraschema = mongoose.Schema({
    para:{
        type:String
    }
})
const Para = mongoose.model('para',paraschema)
export default Para