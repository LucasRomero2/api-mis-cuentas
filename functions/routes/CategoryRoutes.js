const { Router } = require("express");
const router = Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/CategoryController");

router.route("/").get(getCategories).post(createCategory)
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;