import express from "express";
import indexController from "#controller/index";

const router = express.Router();

/* GET home page. */
router.get("/", indexController.home);
router.post("/listener", indexController.listener);

export default router;
