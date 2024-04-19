// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
const dbURI = process.env.ATLAS_URL;
const cors = require('cors');
app.use(cors());



mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
const db = mongoose.connection;


const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  phone: String, 
  gender: String, 
  name: String, 
  lastname: String
});


//FoodPosting schema
const FoodPostingSchema = new mongoose.Schema({
  donor_id: String,
  item_name: String,
  item_category: String,
  item_quantity: String,
  description: String,
  item_location: String,
  pick_up_start_time: String,
  pick_up_end_time: String,
  pick_up_date: String,
  item_expiration_date: String,
  image_url: String,
  available: { type: Boolean, default: true }, // Set default value to false
  date_posted: { type: Date, default: Date.now }
});


const FoodRequestSchema = new mongoose.Schema({
  requester_id: String,
  food_id: String,
  donor_id: String,
  proposed_pick_up_time: String,
  timestamp: { type: Date, default: Date.now }
});


const User = mongoose.model('User', UserSchema);
const Food_Posting = mongoose.model('Food_Posting', FoodPostingSchema);
const Food_Request = mongoose.model('Food_Request', FoodRequestSchema);


app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});


// Register route
app.post('/register', async (req, res) => {
  const { email, password, phone, gender, name, lastname} = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ email, password, phone, gender, name, lastname });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Password matches, login successful
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update user route
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { email, password }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user_profile = await User.findById(id);
    if (!user_profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({user_profile});
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete user route
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Signout route
app.get('/signout', (req, res) => {
  res.status(200).json({ message: 'Signout successful' });
});



app.post('/add_food_posting', async (req, res) => {
  const { donor_id, item_name, item_category, item_quantity, description, item_location, pick_up_start_time, pick_up_end_time, pick_up_date, item_expiration_date, image_url } = req.body;

  // Check if any required field is empty or not provided
  if (!donor_id || !item_name || !item_category || !item_quantity || !description || !item_location || !pick_up_start_time || !pick_up_end_time || !pick_up_date || !item_expiration_date || !image_url) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newFoodPosting = new Food_Posting({
      donor_id,
      item_name,
      item_category,
      item_quantity,
      description,
      item_location,
      pick_up_start_time,
      pick_up_end_time,
      pick_up_date,
      item_expiration_date,
      image_url
    });

    // Save new food posting to MongoDB
    await newFoodPosting.save();

    res.status(201).json({ message: 'Food posting added successfully', newFoodPosting });
  } catch (error) {
    console.error('Error adding food posting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





app.delete('/delete_food_posting/:id', async (req, res) => {
  const foodPostingId = req.params.id;

  try {
    // Find food posting by ID and delete it
    const deletedFoodPosting = await Food_Posting.findByIdAndDelete(foodPostingId);

    if (!deletedFoodPosting) {
      return res.status(404).json({ message: 'Food posting not found' });
    }

    res.status(200).json({ message: 'Food posting deleted successfully' });
  } catch (error) {
    console.error('Error deleting food posting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get food by ID
app.get('/get_food/:id', async (req, res) => {
  const foodId = req.params.id;
  try {

      const foodPosting = await Food_Posting.findById(foodId);

      if (!foodPosting) {
          return res.status(404).json({ message: 'Food not found' });
      }
      res.status(200).json({ foodPosting });
  } catch (error) {
      console.error('Error retrieving food:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/get_food_by_donor/:donor_id', async (req, res) => {
  const donorId = req.params.user_id;
  try {

    const foodPostings = await Food_Posting.find({ donor_id: donorId });

    if (foodPostings.length === 0) {
      return res.status(404).json({ message: 'No food postings found for this user' });
    }

    res.status(200).json({ foodPostings });
  } catch (error) {
    console.error('Error retrieving food postings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all foods
app.get('/get_all_foods', async (req, res) => {
  try {

      const allFoods = await Food_Posting.find();

      res.status(200).json({ allFoods });
  } catch (error) {
      console.error('Error retrieving all foods:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Get all foods with a certain location
app.get('/get_foods_by_location/:location', async (req, res) => {
  const location = req.params.location;

  try {

      const foodsByLocation = await Food_Posting.find({ item_location: location });

      res.status(200).json({ foodsByLocation });
  } catch (error) {
      console.error('Error retrieving foods by location:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all foods by category
app.get('/get_foods_by_category/:category', async (req, res) => {
  const category = req.params.category;

  try {
      // Find food postings by category
      const foodsByCategory = await Food_Posting.find({ item_category: category });

      res.status(200).json({ foodsByCategory });
  } catch (error) {
      console.error('Error retrieving foods by category:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


//Making a request for food
app.post('/request_food', async (req, res) => {
  const { requester_id, food_id, donor_id, proposed_pick_up_time } = req.body;

  try {
    // Check if the food exists
    const food = await Food_Posting.findById(food_id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Set food availability to false
    food.available = false;
    await food.save();

    // Create new food request
    const newFoodRequest = new Food_Request({
      requester_id,
      food_id,
      donor_id,
      proposed_pick_up_time
    });
    await newFoodRequest.save();

    res.status(201).json({ message: 'Food request added successfully', newFoodRequest });
  } catch (error) {
    console.error('Error adding food request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




//Getting all food requests
app.post('/receiver_get_all_food_requests', async (req, res) => {
  try {

    const {requesterId} = req.body;

    if (!requesterId) {
      return res.status(400).json({ message: 'Both receiver_id and request_id are required parameters' });
    }
    const allFoodRequests = await Food_Request.find({requester_id : requesterId});

    res.status(200).json({ allFoodRequests });
  } catch (error) {
    console.error('Error retrieving all food requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/donor_get_all_food_requests', async (req, res) => {
  try {
    const {donorId} = req.body;
    if (!donorId) {
      return res.status(400).json({ message: 'donor_id is a required parameters' });
    }
    const allFoodRequests = await Food_Posting.find({donor_id: donorId});

    res.status(200).json({ allFoodRequests });
  } catch (error) {
    console.error('Error retrieving all food requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
