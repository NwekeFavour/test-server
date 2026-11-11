const express = require('express');
const router = express.Router();


router.get("/products", (req, res) => {
    res.json({
        message: "This is coming from my server",
        products: [
            {  
                id: 1,
                productname: "Product 1",
                price: 100,
                description: "This is product 1"
            }
     ]
    })
})


module.exports = router;