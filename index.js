
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const products = require("./routes/products")

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage for learning purposes


app.use("/api", products);






app.get("/api/plans", (req, res) => {
  const terms = "terms & condition are explained below"
  const services ="this is data is a test from the backend"
  const text = "Hello from the server"
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 5000,
      duration: "1 month",
      features: [
        "Access to basic features",
        "Email support",
        "Limited storage",
        "Basic analytics",
      ],
    },
    {
      id: 2,
      name: "Premium",
      price: 10000,
      duration: "1 year",
      features: [
        "Access to basic features",
        "Email support",
        "Limited storage",
        "Basic analytics",
      ],
    },
  ];

  res.status(200).json({
    success: true,
    data: plans,
    services,
    terms, 
    text
  });
});


app.get("/api/services", (req,res) => {
  res.status(200).json({
    data: "Welcome to COD201"
  })
})

app.get("/api/home", (req, res) => {
  const data = [
    {
      id: 1,
      address: "RD315, Plot No.B4 Behind Nepa Quarters",
      PhoneNo: "09126262661",
      gender: "male"
    },
    
    {
      id: 2,
      address: "RD320, Plot No.B10 Behind Nepa Quarters",
      PhoneNo: "09126262667",
      gender: "female"
    },
    {
      id: 3,
      address: "RD310, Plot No.B7 Behind Nepa Quarters",
      PhoneNo: "0912626067",
      gender: "female"
    },
    {
      id: 4,
      address: "RD302, Plot No.B20 Behind Nepa Quarters",
      PhoneNo: "09126262s7",
      gender: "female"
    }
  ]


  res.json({
    data
  })
})

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
