const express = require("express");

const CategoryController = require("../controllers/category");

const authCheck = require("../middleware/check-auth");

const router = express.Router();
router.post("/createCategory", CategoryController.createCategory);
router.get("/AllCategories", CategoryController.AllCategories);
router.post('/deleteCategoryById/:id',CategoryController.deleteCategoryById);
router.put("/editCategory", CategoryController.UpdateCategory);
router.post('/getCategoryById',CategoryController.getCategoryById);

router.post("/disactiveCategory/:id", CategoryController.disactiveCategory);
router.post("/activeCategory/:id", CategoryController.activeCategory);

router.post("/getProductsByCategoryId", CategoryController.getProductsByCategoryId);
router.post("/getSubCategoriesByCategoryId", CategoryController.getSubCategoriesByCategoryId);
router.post("/getSubCategoriesByCategoryIdP", CategoryController.getSubCategoriesByCategoryIdP);

router.get("/CategorieAddpost", CategoryController.CategorieAddpost);
//router.get("/AllCategoryMakes", CategoryController.AllCategoryMakes);
//router.get("/CatModel", CategoryController.AllCategoryMakes);

router.get("/getCategoryParent", CategoryController.getCategoryParent);

module.exports = router;