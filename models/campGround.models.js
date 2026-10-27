import mongoose, { Schema } from "mongoose";

const CampGroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String  
    },
    price: {
        type: Number,
    },
    description: {
        type: String 
    },
    location: {
        type: String
    }
}, {timestamps: true})

const CampGround = mongoose.model('Campground', CampGroundSchema);

export default CampGround;