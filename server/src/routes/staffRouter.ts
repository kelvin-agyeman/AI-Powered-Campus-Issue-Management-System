import { Router } from "express";
const router = Router();
import {
  getAssignedIssues,
  getAssignedIssueById,
  acceptAssignment,
  updateProgress,
  resolveIssue,
  reopenIssue,
} from "../controllers/staffController";
import validate from "../middleware/validationMiddleware";
import {
  updateProgressSchema,
  resolveIssueSchema,
} from "../validators/staff.validator";
import { upload } from "../middleware/multerMiddleware";

router.route("/issues").get(getAssignedIssues);

router.route("/issues/:id").get(getAssignedIssueById);

router.route("/issues/:id/accept").patch(acceptAssignment);

router
  .route("/issues/:id/progress")
  .patch(validate(updateProgressSchema), updateProgress);

router
  .route("/issues/:id/resolve")
  .patch(upload.array("images", 5), validate(resolveIssueSchema), resolveIssue);

router.route("/issues/:id/reopen").patch(reopenIssue);

export default router;
