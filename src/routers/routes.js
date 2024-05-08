const express = require ('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const authcontrollers = require('../auth-controllers/Controllers');

router.route("/home").get(authcontrollers.home);

router.route("/").get(authcontrollers.index);

router.route("/signup").get(authcontrollers.signup);

router.route("/login").get(authcontrollers.login);

router.route("/signup").post(authcontrollers.signUp);

router.route("/login").post(authcontrollers.Login);

router.route("/shoppingcart").get(authcontrollers.ShoppingCart);

router.get("/logout",auth, async(req,res)=>{
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("Login",{title: 'Login to Order'});
    } catch (error) {
        res.status(500).send(error)
    }
});

router.route('/add-to-cart/:id').get(authcontrollers.CartFunction);

router.route("/checkout").post(authcontrollers.checkout);

module.exports = router;