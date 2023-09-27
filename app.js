const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configure EJS as the template engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Get the MongoDB Atlas connection URI from the environment variable
const uri = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

// Create a mongoose model for users
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Serve a simple HTML form
app.get('/', (req, res) => {
  res.render('index');
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Create a new user in the database
    const user = new User({ username, password });
    await user.save();

    // Redirect to a page that displays the entered data
    res.redirect('/display');
  } catch (err) {
    console.error('Error saving user data:', err);
    res.send('An error occurred while saving user data.');
  }
});

// Display entered data
app.get('/display', async (req, res) => {
  try {
    const users = await User.find();
    res.render('display', { users });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.send('An error occurred while fetching user data.');
  }
});

app.listen(port, () => {
  console.log(`Your server is running on port number ${port}`);
});
