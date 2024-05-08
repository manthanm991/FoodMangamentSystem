const bcrypt = require("bcryptjs");
const userRegister = require("../models/userData");
const MenuData = require("../models/MenuData");
const Cart = require('../models/cart');
const Order = require('../models/order');
const cart = require("../models/cart");

const home = async (req, res) => {
  try {
    res.status(200).render("Signup", { title: "Sign Up" });
  } catch (e) {
    console.log(e);
  }
};

const index = async (req, res) => {
  try {
    // const menuByCategory = {};
    // MenuDatas.forEach((item) => {
    //   if (!menuByCategory[item.category]) {
    //     menuByCategory[item.category] = [];
    //   }
    //   menuByCategory[item.category].push(item);
    // });

    // res.render("index", { menuByCategory: menuByCategory });

    const data = await MenuData.find().exec();
    const menuChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < data.length; i += chunkSize) {
      menuChunks.push(data.slice(i, i + chunkSize));
    }
    res
      .status(200)
      .render("index", {
        title: "FOMS- Order without hesitation",
        MenuDatas: menuChunks,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const signup = async (req, res) => {
  try {
    res.status(200).render("Signup", { title: "Sign Up" });
  } catch (e) {
    console.log(e);
  }
};

const login = async (req, res) => {
  try {
    res.status(200).render("Login", { title: "Login to Order" });
  } catch (e) {
    console.log(e);
  }
};

const signUp = async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const registerUser = new userRegister({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        password: password,
        cpassword: cpassword,
      });

      const token = await registerUser.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });

      const registered = await registerUser.save();
      res.status(201).render("Login");
    } else {
      res.send("Passwords do not match");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userEmail = await userRegister.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);
    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60*60*1000),
      httpOnly: true,
    });

    if (!isMatch) {
        res.send("Invalid Login Details");
    }
        // res
        // .status(201)
        // .render("index", { title: "FOMS- Order without hesitation" });
        res.redirect('/');
    
  } catch (error) {
    res.status(400).send("Invalid Login Details");
  }
};

const CartFunction = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    const menuData = await MenuData.findById(productId).exec();
    if (!menuData) {
      return res.redirect("/");
    }
    cart.add(menuData, menuData.id);
    req.session.cart = cart;
    req.session.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};

const ShoppingCart = async (req, res) => {
  try {
    if(!req.session.cart){
      return res.status(200).render("ShoppingCart", { title: "Cart",MenuDatas: null});
    }
    var cart = new Cart(req.session.cart);
    cart.addGST(18);
    req.session.cart = cart;
    res.status(200).render("ShoppingCart", { title: "Cart", MenuDatas: cart.generateArray(), totalPrice: cart.totalPrice});
  } catch (e) {
    console.log(e);
  }
};

// const deleteCartItem = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const cart = new Cart(req.session.cart ? req.session.cart : {});

//     // Remove item from the cart
//     cart.removeItem(productId);
//     req.session.cart = cart;
//     req.session.save();
//     res.redirect("/shoppingcart");
//   } catch (error) {
//     console.error(error);
//     res.redirect("/shoppingcart");
//   }
// };

const checkout = async (req, res) => {
  try {
    var cart = new Cart(req.session.cart);
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
    });

    const savedOrder = await order.save();

    req.flash('success', 'Order Placed');
    req.session.cart = null;
    res.redirect('/');
  } catch (error) {
    console.error('Error in checkout:', error);
    req.flash('error', 'An unexpected error occurred');
    res.redirect('/checkout');
  }
};

module.exports = { home, index, signup, login, signUp, Login, ShoppingCart,CartFunction,checkout};
