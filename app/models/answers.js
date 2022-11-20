import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AnswersSchema = new Schema({

survey_id: Number,
surveyTemplate_id:Number,
answers: [String]

}, {
    timestamps: true,
    collection: 'answers'
});

export default mongoose.model('Answers', AnswersSchema);