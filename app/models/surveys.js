import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    name: String, 
    question: String,
    answerOne: String,
    answerTwo: String,
    answerThree: String,
    answerFour: String
}, {
    timestamps: true,
    collection: 'surveys'
});

export default mongoose.model('Surveys', SurveySchema);