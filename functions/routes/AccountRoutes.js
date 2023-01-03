const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const router = Router();

const {
  getAccounts,
  createAccount
} = require("../controllers/AccountController");

const accountRules = [
  [
    body("user_uid").exists().withMessage("Propiedad user_uid es requerida"),
    body("name").exists().withMessage("Propiedad name es requerida"),
    body("icon_url").exists().withMessage("Propiedad icon_url es requerida"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
      next();
    },
  ]
]

router.route("/").post(accountRules,createAccount)
router.route("/:userUID").get(getAccounts)

module.exports = router;