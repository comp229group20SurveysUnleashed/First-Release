import mongoose from 'mongoose';

const Schema = mongoose.Schema;
//needs to be worked on, what else should be added to the schema
const SurveySchema = new Schema({
    title: String,
    question: String, 
    answer: String
}, {
    timestamps: true,
    collection: 'surveys'
});

export default mongoose.model('Surveys', SurveySchema);