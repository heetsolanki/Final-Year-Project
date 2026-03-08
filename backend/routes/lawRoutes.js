const express = require("express");
const router = express.Router();

const { getAllLaws, getLawById } = require("../controllers/lawController");

router.get("/", getAllLaws);

router.get("/:id", getLawById);

module.exports = router;
