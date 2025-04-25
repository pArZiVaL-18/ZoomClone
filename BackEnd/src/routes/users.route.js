import { Router } from "express";
import {
    addToHistory,
    getUserHistory,
    login,
    register,
    saveMeetTime,
    markUserAsAttended,
} from "../controllers/user.controller.js";

const router = new Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/get_all_activity").get(getUserHistory);
router.route("/meetings/markAttended").put(markUserAsAttended);
router.route("/save_meet_time").post(saveMeetTime);
// router.put("/meetings/markAttended", markUserAsAttended);

export default router;
