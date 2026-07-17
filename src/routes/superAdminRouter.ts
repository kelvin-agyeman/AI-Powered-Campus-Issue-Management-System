import { Router } from "express";
const router = Router();
import {
  registerAdmin,
  registerStaff,
  reactivateUser,
  deactivateUser,
  approveEditRequest,
  getEditRequests,
  getDashboardAnalytics,
  getAllUsers,
  getUserById,
  sendBroadcast,
  rejectEditRequest,
  updateUser,
} from "../controllers/superAdminController";
import validate from "../middleware/validationMiddleware";
import {
  registerAdminSchema,
  registerStaffSchema,
  updateUserSchema,
  broadcastSchema,
} from "../validators/superAdmin.validator";

router.route("/dashboard").get(getDashboardAnalytics);

router.route("/broadcast").post(validate(broadcastSchema), sendBroadcast);

router.route("/admins").post(validate(registerAdminSchema), registerAdmin);

router.route("/staff").post(validate(registerStaffSchema), registerStaff);

router.route("/users").get(getAllUsers);

router
  .route("/users/:id")
  .get(getUserById)
  .patch(validate(updateUserSchema), updateUser);

router.route("/users/:id/deactivate").patch(deactivateUser);

router.route("/users/:id/reactivate").patch(reactivateUser);

router.route("/edit-requests").get(getEditRequests);

router.route("/edit-requests/:id/approve").patch(approveEditRequest);

router.route("/edit-requests/:id/reject").patch(rejectEditRequest);

export default router;
