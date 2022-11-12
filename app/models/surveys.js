import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    title: String, 
    question: String,
    answer: String,
    participate: Number
}, {
    timestamps: true,
    collection: 'surveys'
});

export default mongoose.model('Surveys', SurveySchema);