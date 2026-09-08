// ======================================
// HARDWAREBHAV.IN BACKEND
// SERVER.JS - PART 1
// ======================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = 5000;

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);

// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message:
            "HardwareBhav Backend is running!"
    });

});

// ======================================
// MONGODB CONNECTION
// ======================================

const MONGODB_URI =
    process.env.MONGODB_URI;

if (!MONGODB_URI) {

    console.log(
        "❌ MONGODB_URI nahi mila!"
    );

    console.log(
        "Backend/.env file check karein."
    );

    process.exit(1);
}

mongoose
    .connect(
        MONGODB_URI,
        {
            serverSelectionTimeoutMS: 10000
        }
    )

    .then(() => {

        console.log(
            "✅ MongoDB Connected Successfully!"
        );

        app.listen(
            PORT,
            () => {

                console.log(
                    `✅ Server running on port ${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.log(
            "❌ MongoDB Connection Failed!"
        );

        console.log(
            error.message
        );

    });



// ======================================
// SHOP MODEL
// ======================================

const productSchema = new mongoose.Schema(
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
    },
    {
        _id: true
    }
);


const shopSchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
            required: true
        },

        ownerName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        mobile: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        },

        products: {
            type: [productSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


const Shop =
    mongoose.model(
        "Shop",
        shopSchema
    );


// ======================================
// SHOP REGISTER
// ======================================

app.post(
    "/api/shops/register",
    async (req, res) => {

        try {

            const {
                shopName,
                ownerName,
                email,
                mobile,
                password,
                address,
                city
            } = req.body;


            if (
                !shopName ||
                !ownerName ||
                !email ||
                !mobile ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All required fields are necessary"

                });

            }


            const existingShop =
                await Shop.findOne({
                    $or: [
                        {
                            email: email
                        },
                        {
                            mobile: mobile
                        }
                    ]
                });


            if (existingShop) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email or mobile already registered"

                });

            }


            const shop =
                await Shop.create({

                    shopName:
                        shopName,

                    ownerName:
                        ownerName,

                    email:
                        email,

                    mobile:
                        mobile,

                    password:
                        password,

                    address:
                        address || "",

                    city:
                        city || "",

                    products:
                        []

                });


            res.status(201).json({

                success: true,

                message:
                    "Shop registered successfully",

                shop: shop

            });

        }
        catch (error) {

            console.log(
                "Register Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Shop registration failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// SHOP LOGIN
// ======================================

app.post(
    "/api/shops/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password required"

                });

            }


            const shop =
                await Shop.findOne({
                    email: email
                });


            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }


            if (
                shop.password !== password
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Wrong password"

                });

            }


            res.json({

                success: true,

                message:
                    "Login successful",

                shopId:
                    shop._id,

                shop:
                    shop

            });

        }
        catch (error) {

            console.log(
                "Login Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Login failed",

                error:
                    error.message

            });

        }

    }
);




// ======================================
// GET ALL SHOPS
// ======================================

app.get(
    "/api/shops",
    async (req, res) => {

        try {

            const shops =
                await Shop.find()
                .select("-password");

            res.json({

                success: true,

                shops: shops

            });

        }
        catch (error) {

            console.log(
                "Get Shops Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Shops fetch failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// GET SINGLE SHOP
// ======================================

app.get(
    "/api/shops/:id",
    async (req, res) => {

        try {

            const shop =
                await Shop.findById(
                    req.params.id
                )
                .select("-password");

            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }

            res.json({

                success: true,

                shop: shop

            });

        }
        catch (error) {

            console.log(
                "Get Shop Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Shop fetch failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// UPDATE SHOP
// ======================================

app.put(
    "/api/shops/:id",
    async (req, res) => {

        try {

            const {
                shopName,
                ownerName,
                address,
                city
            } = req.body;


            const shop =
                await Shop.findByIdAndUpdate(

                    req.params.id,

                    {
                        shopName:
                            shopName,

                        ownerName:
                            ownerName,

                        address:
                            address,

                        city:
                            city
                    },

                    {
                        returnDocument: "after",

                        runValidators: false
                    }
                );


            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Shop updated successfully",

                shop: shop

            });

        }
        catch (error) {

            console.log(
                "Update Shop Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Shop update failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// SET SHOP LOCATION
// ======================================

app.put(
    "/api/shops/:id/location",
    async (req, res) => {

        try {

            const {
                latitude,
                longitude
            } = req.body;


            const lat =
                Number(latitude);

            const lng =
                Number(longitude);


            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid latitude and longitude required"

                });

            }


            const shop =
                await Shop.findByIdAndUpdate(

                    req.params.id,

                    {
                        latitude: lat,

                        longitude: lng
                    },

                    {
                        returnDocument: "after",

                        runValidators: false
                    }
                );


            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Shop location updated successfully",

                latitude:
                    shop.latitude,

                longitude:
                    shop.longitude

            });

        }
        catch (error) {

            console.log(
                "Location Update Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Location update failed",

                error:
                    error.message

            });

        }

    }
);



// ======================================
// ADD PRODUCT
// ======================================

app.post(
    "/api/shops/:id/products",
    async (req, res) => {

        try {

            const {
                name,
                price,
                category,
                unit
            } = req.body;

            if (
                !name ||
                price === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product name and price required"

                });

            }

            const shop =
                await Shop.findById(
                    req.params.id
                );

            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }

            const product = {

                name: name,

                price: Number(price),

                category:
                    category || "Other",

                unit:
                    unit || "Piece"

            };

            await Shop.findByIdAndUpdate(

                req.params.id,

                {
                    $push: {
                        products: product
                    }
                },

                {
                    returnDocument: "after",

                    runValidators: false
                }

            );

            res.json({

                success: true,

                message:
                    "Product added successfully"

            });

        }
        catch (error) {

            console.log(
                "Add Product Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Product add failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// UPDATE PRODUCT
// ======================================

app.put(
    "/api/shops/:shopId/products/:productId",
    async (req, res) => {

        try {

            const {
                name,
                price,
                category,
                unit
            } = req.body;

            if (
                !name ||
                price === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product name and price required"

                });

            }

            const result =
                await Shop.updateOne(

                    {
                        _id:
                            req.params.shopId,

                        "products._id":
                            req.params.productId
                    },

                    {
                        $set: {

                            "products.$.name":
                                name,

                            "products.$.price":
                                Number(price),

                            "products.$.category":
                                category || "Other",

                            "products.$.unit":
                                unit || "Piece"

                        }
                    },

                    {
                        runValidators: false
                    }

                );

            if (
                result.matchedCount === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop or product not found"

                });

            }

            res.json({

                success: true,

                message:
                    "Product updated successfully"

            });

        }
        catch (error) {

            console.log(
                "Update Product Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Product update failed",

                error:
                    error.message

            });

        }

    }
);


// ======================================
// DELETE PRODUCT
// ======================================

app.delete(
    "/api/shops/:shopId/products/:productId",
    async (req, res) => {

        try {

            const shop =
                await Shop.findById(
                    req.params.shopId
                );

            if (!shop) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Shop not found"

                });

            }

            const product =
                shop.products.id(
                    req.params.productId
                );

            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }

            await Shop.updateOne(

                {
                    _id:
                        req.params.shopId
                },

                {
                    $pull: {

                        products: {

                            _id:
                                req.params.productId

                        }

                    }

                },

                {
                    runValidators: false
                }

            );

            res.json({

                success: true,

                message:
                    "Product deleted successfully"

            });

        }
        catch (error) {

            console.log(
                "Delete Product Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Product delete failed",

                error:
                    error.message

            });

        }

    }
);
