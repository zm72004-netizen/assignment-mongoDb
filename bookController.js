import Book from '../models/bookModel.js';
import Log from '../models/logModel.js';
import mongoose from 'mongoose';

export const createBooksCollection = async (req, res) => {
    try {
        await mongoose.connection.createCollection("books", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title"],
                    properties: {
                        title: { bsonType: "string" }
                    }
                }
            }
        });
        res.status(201).json({ ok: 1 });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const createAuthorsCollection = async (req, res) => {
    try {
        const Author = mongoose.connection.collection('authors');
        const result = await Author.insertOne({ name: "Author1", nationality: "British" });
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const createCappedLogs = async (req, res) => {
    try {
        await mongoose.connection.createCollection("logs", { capped: true, size: 1048576 });
        res.status(201).json({ ok: 1 });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const createBookIndex = async (req, res) => {
    try {
        await Book.collection.createIndex({ title: 1 });
        res.status(200).json({ message: "title_1" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const insertSingleBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({ acknowledged: true, insertedId: book._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const insertBatchBooks = async (req, res) => {
    try {
        const books = await Book.insertMany(req.body);
        const insertedIds = {};
        books.forEach((b, index) => {
            insertedIds[index] = b._id;
        });
        res.status(201).json({ acknowledged: true, insertedIds });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const insertLog = async (req, res) => {
    try {
        const log = await Log.create(req.body);
        res.status(201).json({ acknowledged: true, insertedId: log._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateBookFuture = async (req, res) => {
    try {
        const result = await Book.updateOne({ title: "Future" }, { $set: { year: 2022 } });
        res.status(200).json({ acknowledged: true, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const findBookByTitle = async (req, res) => {
    try {
        const book = await Book.findOne({ title: req.query.title });
        res.status(200).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const findBooksByYearRange = async (req, res) => {
    try {
        const { from, to } = req.query;
        const books = await Book.find({ year: { $gte: Number(from), $lte: Number(to) } });
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const findBooksByGenre = async (req, res) => {
    try {
        const books = await Book.find({ genres: req.query.genre });
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getSkipLimitBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ year: -1 }).skip(2).limit(3);
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const findYearInteger = async (req, res) => {
    try {
        const books = await Book.find({ year: { $type: "int" } });
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const excludeGenres = async (req, res) => {
    try {
        const books = await Book.find({ genres: { $nin: ["Horror", "Science Fiction"] } });
        res.status(200).json(books);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteBeforeYear = async (req, res) => {
    try {
        const year = Number(req.query.year);
        const result = await Book.deleteMany({ year: { $lt: year } });
        res.status(200).json({ acknowledged: true, deletedCount: result.deletedCount });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const aggregate1 = async (req, res) => {
    try {
        const result = await Book.aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $sort: { year: -1 } }
        ]);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const aggregate2 = async (req, res) => {
    try {
        const result = await Book.aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $project: { _id: 0, title: 1, author: 1, year: 1 } }
        ]);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const aggregate3 = async (req, res) => {
    try {
        const result = await Book.aggregate([
            { $unwind: "$genres" },
            { $project: { title: 1, genres: 1 } }
        ]);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const aggregate4 = async (req, res) => {
    try {
        const result = await Log.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book_id",
                    foreignField: "_id",
                    as: "book_detail"
                }
            }
        ]);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};