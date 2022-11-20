import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SurveySchema = new Schema({

survey_id:Number,
surveyTemplate_id:Number,
user_id: Number,
survey_title: String,
start_date: Date,
end_date: Date,
questions: [String]

}, {
    timestamps: true,
    collection: 'surveys'
});

export default mongoose.model('Surveys', SurveySchema);