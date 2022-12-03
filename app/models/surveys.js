import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SurveySchema = new Schema({
    title: String,
    startdate: Date,
    enddate: Date,
    userid: String,
    active: Boolean,
    questions: []
}, {
    timestamps: true,
    collection: 'surveys'
});

export default mongoose.model('Surveys', SurveySchema);