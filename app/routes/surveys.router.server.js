import { Router } from "express";
import { DisplaySurveyList, 
    DisplaySurveysAddPage, 
    ProcessSurveysAddPage, 
    ProcessSurveysEditPage, 
    DisplaySurveysEditPage, 
    ProcessSurveyDeletePage,
    DisplaySurveysCustomizePage,
    ProcessSurveysCustomizePage, 
    DisplaySurveysJoinPage,
    ProcessSurveysJoinPage, DisplaySurveyReportPage   } from "../controllers/surveys.controller.server.js";

import { AuthGuard } from "../utils/index.js";

const router = Router();

router.get('/survey-list', DisplaySurveyList);
router.get('/survey-add', DisplaySurveysAddPage);
router.post('/survey-add', ProcessSurveysAddPage);
router.post('/survey-edit/:id', ProcessSurveysEditPage);
router.get('/survey-edit/:id', DisplaySurveysEditPage);
router.post('/survey-customize/:id', ProcessSurveysCustomizePage);
router.get('/survey-customize/:id', DisplaySurveysCustomizePage);
router.get('/survey-delete/:id', ProcessSurveyDeletePage);
router.get('/survey-join/:id', DisplaySurveysJoinPage);
router.post('/survey-join/:id', ProcessSurveysJoinPage);
//////////////////////////// Reports Route ///////////////////// --- MADE CHANGES HERE 
router.get('/surveys-reports/:id', DisplaySurveyReportPage)
///////////////////////////////////////////////////////////////////////////////////////


export default router;