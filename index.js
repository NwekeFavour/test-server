require("dotenv").config();
const express = require("express");
const cors = require("cors");
const products = require("./routes/products");
const auth = require("./routes/auth");
const connectDB = require("./db/connectDB");

const app = express();

app.use(cors());
// This lets Express read JSON request bodies into req.body.
app.use(express.json());

// Mount the authentication routes. The User model is used inside auth.js
// to read and write users in MongoDB.
app.use("/api", products);
app.use("/api/auth", auth);
// These mounts keep the earlier registration and login URLs working too.
app.use("/api/users", auth);
app.use("/login", auth);


  
   


app.get("/api/plans", (req, res) => {
  const terms = "terms & condition are explained below"
  const services ="this is data is a test from the backend"
  const text = "Hello from the server"
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 5000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1GN9kOLFIaxfTny44kT9ewkqWMePq3234Ir5EBVsEQ&s=10",
      duration: "1 month",
      description: "Perfect for freelancers and startups.",
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
      image: "https://cdn.thewirecutter.com/wp-content/media/2026/08/BEST-ANDROID-PHONES-2048px-4356-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp",
      price: 10000,
      duration: "1 year",
      description: "Great for growing teams and small businesses.",
      features: [
        "Access to basic features",
        "Email support",
        "Limited storage",
        "Basic analytics",
      ],
    },
        {
      id: 2,
      name: "Premium Beta",
      price: 15000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIeB--Y0ZDz9VuXCXfAzh37_8RSm3_0vHqqQg5A1Jojg&s=10",
      duration: "1 year",
      description: "Great for growing teams and small businesses.",
      features: [
        "Access to basic features",
        "Email support",
        "Limited storage",
        "Basic analytics",
      ],
    },
        {
      id: 2,
      name: "Premium Plus",
      price: 20000,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKBX1BkQGcSqI3MiJWQOmzceTdJHvL3zc_liXQn8tKDne2hpCaDADoR-k&s=10",
      duration: "2 years",
      description: "Great for growing teams and small businesses.",
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


const ITEMS = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99 },
  { id: 2, name: 'Leather Wallet', category: 'Accessories', price: 45.00 },
  { id: 3, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99 },
  { id: 4, name: 'Running Shoes', category: 'Apparel', price: 120.00 },
];

//  Query & Parameters
// http://localhost:3000/:id


// Query example 
app.get("/about-us", (req,res) => {
  let  {name, age}= req.query;

  if(age === undefined) {
    age = ""
  }

  res.json({
    message: `hello ${name}, welcome to about us page ${age && ` and your age is ${age}`}`
    // message: `hello ${name}, welcome to your about us page${age  ? ` and your age is ${age} ` : "" }`
  })
})

// route params example
app.get("/items/:id", (req, res) => {
  const {id} = req.params;

  res.json({
    message: `hello, welcome to your item page with ${id}`
  })
})



// Create a GET route that handles requests to /api/items
app.get('/api/items', (req, res) => {

  // Get the search query (q) and category from the URL query parameters
  // Example: /api/items?q=rice&category=Food
  const { q, category } = req.query;

  // Create a copy of the ITEMS array so we don't modify the original data
  let filteredItems = [...ITEMS];

  // 1. TEXT SEARCH FILTER
  // Check if the user provided a search query (q)
  if (q) {
    // Loop through the items and keep only those whose names contain
    // the search query. Convert both to lowercase so the search
    // is not affected by uppercase or lowercase letters.
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  // 2. CATEGORY FILTER
  // Check if a category was provided and make sure it isn't "All"
  if (category && category !== 'All') {

    // Keep only items whose category matches the selected category.
    // Convert both categories to lowercase to make the comparison
    // case-insensitive.
    filteredItems = filteredItems.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Send the filtered items back to the client as a JSON response
  res.json({products: filteredItems});
});

const port = process.env.PORT || 3000;

// Wait for MongoDB before accepting requests so auth operations always have
// their User collection available.
async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  await connectDB();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start server:", error);
  process.exitCode = 1;
});
