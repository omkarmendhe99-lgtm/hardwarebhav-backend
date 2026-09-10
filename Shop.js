const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
{
    ownerName: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true
    },

    // Shop Login Password
    password: {
        type: String,
        required: true
    },

    shopName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    products: [
        {
            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            category: {
                type: String,
                default: "Other"
            },

            unit: {
                type: String,
                default: "Piece"
            }
        }
    ]
    active: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Shop", shopSchema);