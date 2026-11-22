const router = require("express").Router();
const controller = require("../controllers/mainController");

router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/mozik", controller.allMozi);
router.get("/filmek/:moziazon", controller.allFilm);
router.get("/diagram", controller.diagram);

module.exports = router;