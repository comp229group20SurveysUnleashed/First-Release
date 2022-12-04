import surveyModel from '../models/surveys.js';
import answerModel from '../models/answers.js';
import { UserDisplayName, UserId } from '../utils/index.js';


export function DisplaySurveyList(req, res, next){
    surveyModel.find(function(err, surveysCollection) {
        if(err){
            console.error(err);
            res.end(err);
        }
        res.render('index', {title: 'Survey List', page: 'surveys/list', 
            surveys: surveysCollection, displayName: UserDisplayName(req), userId: UserId(req)});
    })
}

export function DisplaySurveysAddPage(req, res, next){
    res.render('index', { title: 'Add a survey', page: 'surveys/add', 
        survey: {}, displayName: UserDisplayName(req), userId: UserId(req) });
}

export function ProcessSurveysAddPage(req, res, next){
    
    let newSurvey = surveyModel({
        title: req.body.title,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        userid: req.body.userid,
        active: !!req.body.active,
        //questions: []
    });
    newSurvey.questions.push(req.body.questions);
    console.log(req.body.questions);
    
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

        res.render('index', { title: 'Edit Survey', page: 'surveys/edit', 
            survey: survey, displayName: UserDisplayName(req), userId: UserId(req) });
    });    
}
export function ProcessSurveysEditPage(req, res, next){

    let q = req.body;
    console.log(q);

    let id = req.params.id;
    
    let newSurvey = surveyModel({
        _id: req.body.id,
        title: req.body.title,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        userid: req.body.userid,
        active: !!req.body.active,
        //questions: []
    });
    //newSurvey.questions.push(req.body.questions);

    surveyModel.updateOne({_id: id }, newSurvey, (err, Survey) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )
}



export function DisplaySurveysJoinPage(req, res, next){
    let id = req.params.id;

    surveyModel.findById(id, (err, survey) => {
        if(err){
            console.error(err);
            res.end(err);
        }
        //let divSurvey = constructSurvey(survey)

        res.render('index', { title: 'Join Survey', page: 'surveys/join',
            survey: survey, displayName: UserDisplayName(req), userId: UserId(req) });
    });    
}

export function ProcessSurveysJoinPage(req, res, next){

    let a = req.body;
    console.log("processing answers controller");
    console.log(a);

    let id = req.params.id;
    
    let newAnswer = answerModel({
        surveyid: id,
        //answers: []
    });


    newAnswer.answers.push(a);
    
    answerModel.create(newAnswer, (err, Answer) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/survey-list')
    } )

}





export function DisplaySurveysCustomizePage(req, res, next){
    let id = req.params.id;
    surveyModel.findById(id, (err, survey) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        res.render('index', { title: 'Customize Survey', page: 'surveys/customize', 
            survey: survey, displayName: UserDisplayName(req), userId: UserId(req) });
    });    
}

export function ProcessSurveysCustomizePage(req, res, next){
    
    let id = req.params.id;
    
    let newSurvey = surveyModel({
        _id: req.body.id,
        title: req.body.title,
        // startdate: req.body.startdate,
        // enddate: req.body.enddate,
        // userid: req.body.userid,
        // active: !!req.body.active,
        //questions: []
    });

    let q = req.body.txtQuestionsArray;
    q = JSON.parse(q);

    for (let i = 0; i < Object.entries(q).length; i++){
        console.log("q :" + i + "  " + JSON.stringify(q[i]));
        newSurvey.questions.push(q[i]);
    }
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
