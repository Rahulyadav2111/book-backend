const mongoose = require('mongoose'); // Import Mongoose for MongoDB schema creation

// Define the Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Book title, required
  author: { type: String, required: true }, // Book author, required
  genre: { type: String, default: '' }, // Book genre, optional (default empty string)
  location: { type: String, required: true }, // Book location, required
  email: { type: String, required: true }, // Contact email, required
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to owner's ID, required
  status: { type: String, enum: ['Available', 'Rented'], default: 'Available' }, // Status, either Available or Rented
});

// Create and export the Book model
module.exports = mongoose.model('Book', bookSchema); // Export Book model for use in other files