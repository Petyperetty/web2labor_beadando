const router = require("express").Router();
const controller = require("../controllers/mainController");
const uzenetController = require("../controllers/uzenetController");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

router.get("/", controller.homeIndex);
router.get("/register", controller.registerGet);
router.post("/register", controller.registerPost);
router.get("/login", controller.loginGet);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/mozik", controller.allMozi);
router.get("/filmek/:moziazon", controller.allFilm);
router.get("/diagram", controller.diagram);
router.get("/kapcsolat", uzenetController.kapcsolatGet);
router.post("/kapcsolat", uzenetController.kapcsolatPost);
router.get("/uzenetek", isLoggedIn, uzenetController.uzenetekGet);

module.exports = router;