import mongoose from "mongoose"

const db =async()=>{
try {
    await mongoose.connect(process.env.MONGOURI)
    console.log('connected ot db')
} catch (error) {
    console.log('erro in connecting to db',error)
}


}
export default db