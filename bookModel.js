import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    author: { type: String },
    year: { type: Number },
    genres: { type: [String] }
});

const Book = mongoose.model('Books', bookSchema);
export default Book;