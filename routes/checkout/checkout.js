const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * Default ship fee. Default to 10.
 */
var shipFee = 10;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    // Get cart information
    let cart = req.session.productList;
    if (cart && req.session.productCount > 0) {
        let products = '';
        let subTotal = 0;
        for (let productId in cart) {
            let product = cart[productId];
            products += `
            <div class="ref-products">
                <div class="ref-product">
                    <div class="ref-product-col">
                        <img class="ref-product-photo"
                            src="https://cdn.reflowhq.com/media/267418190/108661429/b82e1b79d627910086003ce6309b2cec_sm.jpg"
                            alt="Dermentum Quisque">
                        <div class ="ref-product-name">${product.name}</div>
                        <div class ="ref-product-secondary">${Number(product.price).toFixed(2)} x ${product.quantity}</div>
                    </div>
                <div class="ref-product-total">$${(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
            </div>
        </div>
            `;
            subTotal += Number(product.price) * Number(product.quantity);
        }

        let options = {};
        options.products = products;
        options.subTotal = subTotal.toFixed(2);
        options.shipFee = shipFee.toFixed(2);
        options.total = (subTotal + shipFee).toFixed(2);

        if (req.session.user) {
            let user = req.session.user;
            options.id = user.info.id;
            options.email = user.info.email;
            options.phone = user.info.phonenum;
        }
        res.render('layouts/checkout', options);
    } else {
        res.sendFile(
            path.join(__dirname, '../../public/layouts/empty_cart.html')
        );
    }


});

module.exports = router;
