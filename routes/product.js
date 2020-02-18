const express = require("express");

 const ProjectController = require("../controllers/product");

const authCheck = require("../middleware/check-auth");

const router = express.Router();


router.post("/createproduct", ProjectController.createProduct);

router.post("/editProduct", ProjectController.UpdateProduct);

//router.put("/editProduct", ProjectController.UpdateProduct);
router.post("/UpdateProductFront", ProjectController.UpdateProductFront);
router.post("/UpdateProductViewed", ProjectController.UpdateProductView);



router.post("/disactiveProduct/:id", ProjectController.disactiveProduct);
router.post("/activeProduct", ProjectController.activeProduct);

router.get("/getSponsoredProducts", ProjectController.getSponsoredProducts);
router.get("/getDailyProducts", ProjectController.getDailyProducts);
router.get('/getFreeProducts',ProjectController.getFreeProducts);

router.get("/getProducts", ProjectController.getProducts);
 router.post('/deleteProductById/:id',ProjectController.deleteProductById);
router.post('/getProductById',ProjectController.getProductById);
router.post('/getProductByCategory',ProjectController.getProductByCategory);
router.post('/getProductByUserId',ProjectController.getProductByUserId);
router.post('/deleteProduct',ProjectController.deleteProduct);
router.post('/getProductByIdFront',ProjectController.getProductByIdFront);


module.exports = router;
