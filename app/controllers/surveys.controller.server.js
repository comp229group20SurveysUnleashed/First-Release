import surveyModel from '../models/surveys.js';
import { UserDisplayName } from '../utils/index.js';

export function DisplaySurveyList(req, res, next){
    surveyModel.find(function(err, surveysCollection) {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.render('index', {title: 'Survey List', page: 'surveys/list', surveys: surveysCollection, displayName: UserDisplayName(req)});
    })
}

export function DisplaySurveysAddPage(req, res, next){

    res.render('index', { title: 'Add a survey', page: 'surveys/add', survey: {}, displayName: UserDisplayName(req) });
}

export function ProcessSurveysAddPage(req, res, next){
    
    let newSurvey = surveyModel({
        title: req.body.title,
        question: req.body.question,
        answer: req.body.answer
    });

    surveyModel.create(newSurvey, (err, Survey) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )
}

export function DisplaySurveysEditPage(req, res, next){
    let id = req.params.id;

    surveyModel.findById(id, (err, survey) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.render('index', { title: 'Edit Survey', page: 'surveys/edit', survey: survey, displayName: UserDisplayName(req) });
    });    
}

export function ProcessSurveysEditPage(req, res, next){

    let id = req.params.id;
    
    let newSurvey = surveyModel({
        _id: req.body.id,
        title: req.body.title,
        question: req.body.question,
        answer: req.body.answer
    });

    surveyModel.updateOne({_id: id }, newSurvey, (err, Survey) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )
}

export function ProcessSurveyDeletePage(req, res, next){
    let id = req.params.id;

    surveyModel.remove({_id: id}, (err) => {
        if (err){
            console.error(err);
            res.end(err);
        }

        res.redirect('/survey-list');
    })
}

export function DisplaySurveysJoinPage(req, res, next){
    let id = req.params.id;

    surveyModel.findById(id, (err, survey) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.render('index', { title: 'Join the Survey', page: 'surveys/list', survey: survey, displayName: UserDisplayName(req) });
    });    
}

export function ProcessSurveysJoinPage(req, res, next){

    let id = req.params.id;
    
    let newSurvey = surveyModel({
        _id: req.body.id,
        title: req.body.title,
        question: req.body.question,
        answer: req.body.answer
    });

    surveyModel.updateOne({_id: id }, newSurvey, (err, Survey) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )
}