
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary storage for learning purposes
const users = [];

// POST: Create a user account
app.post("/api/users/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check whether username already exists
    const existingUser = users.find(
      (user) => user.firstname === firstname
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
});

// GET: Retrieve all users
app.get("/api/users", (req, res) => {
  const safeUsers = users.map(({ id, firstname }) => ({
    id,
    firstname,
  }));

  res.status(200).json({
    success: true,
    count: safeUsers.length,
    users: safeUsers,
  });
});



app.get("/api/plans", (req, res) => {
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
  ];

  res.status(200).json({
    success: true,
    data: plans,
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
      address: "RD315, Plot No.B4 Behind Nepa Quarters",
      PhoneNo: "09126262661",
      gender: "male"
    },
    
    {
      address: "RD320, Plot No.B4 Behind Nepa Quarters",
      PhoneNo: "09126262667",
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
