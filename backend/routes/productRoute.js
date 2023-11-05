const express = require("express");
const { getAllProducts, createProduct, updateProduct,
    deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts }
    = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).
    put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;