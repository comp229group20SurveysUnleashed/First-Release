import { Router } from "express";
import {  DisplayProfilePage, ProcessProfileChangePage } from "../controllers/profile.controller.server.js";
import { AuthGuard } from "../utils/index.js";

const router = Router();

router.get('/profile', AuthGuard, DisplayProfilePage);
//router.get('/change-password', AuthGuard, ChangePassword);

router.post('/profile', ProcessProfileChangePage);


export default router;
////