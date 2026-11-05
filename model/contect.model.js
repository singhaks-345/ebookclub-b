import mongoose from "mongoose";

const contectSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
});

// Use the same name for the model and schema for clarity
const Contect = mongoose.model("Contect", contectSchema);

export default Contect;
