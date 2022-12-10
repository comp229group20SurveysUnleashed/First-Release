import surveyModel from '../models/surveys.js';
import answerModel from '../models/answers.js';
import { UserDisplayName, UserId } from '../utils/index.js';



export function DisplaySurveyList(req, res, next){
 
    //let id = req.params.id;
    
    console.log(UserId(req).toString());
 
    let condition = {userid : UserId(req).toString()};
 
    if (UserId(req).length == 0) condition = {$and:[{active:true},{enddate:{ $gte: Date.now() }}]};   
    
    surveyModel.find(condition , function(err, surveysCollection) {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Survey Reports Controller ///////////////// ---- MADE CHANGES HERE -----
export function DisplaySurveyReportPage(req,res,next){
    // Getting the id from survey/list page for the id of the survey - present in header when redirection takes place via route 
    let id = req.params.id;
    
    // Creation of two object arrays that will be exported to be injected in ejs template for reports page
    let answerCollection = [];
    let questionsCollection = [];

    // creation of answer object via answerCollection in answers.js
    answerModel.find({surveyid : id}, (err, Answer) =>{
        if(err){
            console.error(err);
            res.end(err);
        }
            // creation of answer collection array from answer object recieved from db - this will be exported via render function to ejs template
            for (let i = 0; i<Answer.length; i++){
                answerCollection.push(Answer[i].answers[0]);           
            }
        
            // console.log(answerCollection); -- debugging purposes

        // creation of survey object via surveyCollection in survey.js
        surveyModel.findById(id, (err, Survey) =>{
            if (err) {
                console.error(err);
                res.end(err);
            }  
            // creation of questions collection array from survey object recieved from db - this will be exported via render function to ejs template 
            for (let i=0; i<Survey.questions.length; i ++){
                questionsCollection.push(Survey.questions[i]);
            }

            // render function to export the collections created above 
            res.render('index', { title: 'Survey Report', page: 'surveys/reports',answer: Answer, answers: answerCollection, surveyQ: questionsCollection, survey: Survey, displayName: UserDisplayName(req) });

        })

    })

}

////////////////////////////////////////////////////////////- Survey report controller ends here ---------------- Made Changes upto here
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

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


// <% surveyQ.forEach((value, key)=> { %>
//     <h5 class="card-title"><%= JSON.stringify(value) %></h5>
// <% }); %>
// <% for(let count1 = 0; count1 < answers.length; count1++) { %>
//     <p class="card-text"><%= JSON.stringify(answers[count1]) %></p>
// <% }; %>