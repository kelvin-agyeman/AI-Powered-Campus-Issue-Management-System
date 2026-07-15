import { Router } from "express";
const router = Router();
import validate from "../middleware/validationMiddleware";
import { upload } from "../middleware/multerMiddleware";
import { createIssueSchema, updateIssueSchema } from "../validators/issue.validator";
import {
  createIssue,
  getSingleIssue,
  getMyReportedIssues,
  updateIssue,
  deleteIssue,
  restoreIssue,
} from "../controllers/issueController";

router
  .route("/")
  .post(upload.array("images", 5), validate(createIssueSchema), createIssue)
  .get(getMyReportedIssues);

router
  .route("/:id")
  .get(getSingleIssue)
  .patch(upload.array("images", 5), validate(updateIssueSchema), updateIssue)
  .delete(deleteIssue);

router.route("/:id/restore").patch(restoreIssue);

export default router;
