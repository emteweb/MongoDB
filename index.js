const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

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
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

// making a fixed list of categories to be used in edit form

const categories = ['fruit', 'vegetable', 'dairy', 'fungi'];

// template for adding a new product
app.get('/products/new', (req, res) => {
    res.render('Products/new', {categories})
}); 

// adding a new product
app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
});

// editing a product
app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('Products/edit', {product, categories});
}); 

// updating edited product
app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`);
});

// deletinga product
app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

// displaying detail of a product
app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('Products/show', { product });
});

// displaying all products
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('Products/index', {products})
});






app.listen(process.env.PORT || 3000, () => console.log('ProductApp listening on port 3000!'));