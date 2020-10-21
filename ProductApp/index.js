const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Product = require('./Models/product');

mongoose.connect('mongodb://localhost:27017/productApp', {useNewUrlParser: true})
        .then(() => {
            console.log("MONGO Connection OPEN")
        })
        .catch(err => { 
            console.log("Connection Error")
            console.log(err)
        });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.post('/products', async(req, res) => {
    const newProduct =  new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
});

app.get('/products', async (req, res) => {
const products = await Product.find();
res.render('Products/index', {products})
});

app.get('/products/new', (req, res) => {
    res.render('Products/new')
});

app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('Products/show', { product });
});

app.listen(process.env.PORT || 3000, () => console.log('ProductApp listening on port 3000!'));