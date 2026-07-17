import { Router } from "express";
const router = Router();
import {
  getAllIssues,
  getPendingIssues,
  getIssueById,
  modifyIssue,
  approveIssue,
  rejectIssue,
  assignStaff,
  getIssueDuplicates,
  getStaffByDepartment,
} from "../controllers/adminController";
import {
  modifyIssueSchema,
  rejectIssueSchema,
  assignStaffSchema,
} from "../validators/admin.validator";
import validate from "../middleware/validationMiddleware";

router.route("/issues").get(getAllIssues);

router.route("/issues/pending").get(getPendingIssues);

router.route("/issues/:id").get(getIssueById);

router.route("/issues/:id/duplicates").get(getIssueDuplicates);

router.route("/issues/:id/approve").patch(approveIssue);

router
  .route("/issues/:id/modify")
  .patch(validate(modifyIssueSchema), modifyIssue);

router
  .route("/issues/:id/reject")
  .patch(validate(rejectIssueSchema), rejectIssue);

router
  .route("/issues/:id/assign")
  .patch(validate(assignStaffSchema), assignStaff);

router.route("/staff/:department").get(getStaffByDepartment);

export default router;
