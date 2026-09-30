import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Books' },
    action: { type: String }
});

const Log = mongoose.model('Logs', logSchema);
export default Log;