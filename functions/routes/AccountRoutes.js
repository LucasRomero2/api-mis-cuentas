const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const router = Router();

const {
  getAccounts,
  createAccount,
  updateAccount,
  disableAccount,
  enableAccount,
} = require("../controllers/AccountController");

const createAccountRules = [
  [
    body("user_uid").exists().withMessage("Propiedad user_uid es requerida"),
    body("name").exists().withMessage("Propiedad name es requerida"),
    body("icon_url").exists().withMessage("Propiedad icon_url es requerida"),
    body("initial_balance")
      .exists()
      .withMessage("Propiedad initial_balance es requerida"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      next();
    },
  ],
];

const editAccountRules = [
  [
    body("name").exists().withMessage("Propiedad name es requerida"),
    body("icon_url").exists().withMessage("Propiedad icon_url es requerida"),
    body("initial_balance")
      .exists()
      .withMessage("Propiedad initial_balance es requerida"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      next();
    },
  ],
];

router.route("/").post(createAccountRules, createAccount);
router.route("/by-user/:userUID").get(getAccounts);
router.route("/:id").put(editAccountRules, updateAccount);
router.route("/disable/:id").put(disableAccount);
router.route("/enable/:id").put(enableAccount);

module.exports = router;
