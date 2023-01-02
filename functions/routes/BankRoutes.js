const { Router } = require("express");
const router = Router();

const {
  getBanks,
} = require("../controllers/BankController");

router.route("/").get(getBanks)

module.exports = router;