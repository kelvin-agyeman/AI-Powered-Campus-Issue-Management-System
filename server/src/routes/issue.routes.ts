import { Router } from "express";
const router = Router();
import validate from "../middleware/validation.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  createIssueSchema,
  updateIssueSchema,
} from "../validators/issue.validator";
import {
  createIssue,
  getSingleIssue,
  getMyReportedIssues,
  updateIssue,
  deleteIssue,
  restoreIssue,
  deleteImage,
} from "../controllers/issue.controller";

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

router.route("/:issueId/images").delete(deleteImage);

export default router;
