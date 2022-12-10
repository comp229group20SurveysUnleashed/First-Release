
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    surveyid: String,
    answers: [],  
}, {
    timestamps: true,
    collection: 'surveyAnswers'
});

export default mongoose.model('Answers', AnswerSchema);