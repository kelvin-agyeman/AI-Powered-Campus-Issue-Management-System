import { Router } from "express";
import rateLimiter from "express-rate-limit";
import {
  getCurrentUser,
  updateUser,
  updateEmail,
  verifyUpdatedEmail,
  sendEditDetailsRequest,
  resendVerificationEmail,
  deleteAvatar,
} from "../controllers/userController";
import { authorizePermissions } from "../middleware/authMiddleware";
import { upload } from "../middleware/multerMiddleware";
import validate from "../middleware/validationMiddleware";
import {
  updateUserSchema,
  verifyUpdatedEmailSchema,
  resendUpdatedEmailVerificationSchema,
  updateEmailSchema,
  sendEditDetailsRequestSchema,
} from "../schemas/user.schema";

const router = Router();

const emailLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    msg: "Too many email requests from this IP, please try again in 15 minutes",
  },
});

const verificationLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many verification attempts, please try again later",
  },
});

router.route("/current").get(getCurrentUser);

router
  .route("/update")
  .patch(upload.single("avatar"), validate(updateUserSchema), updateUser);

router
  .route("/update-email")
  .patch(emailLimiter, validate(updateEmailSchema), updateEmail);

router
  .route("/verify-updated-email")
  .post(
    verificationLimiter,
    validate(verifyUpdatedEmailSchema),
    verifyUpdatedEmail,
  );

router
  .route("/resend-verification-email")
  .post(
    emailLimiter,
    validate(resendUpdatedEmailVerificationSchema),
    resendVerificationEmail,
  );

router
  .route("/send-edit-details-request")
  .post(
    authorizePermissions("student"),
    validate(sendEditDetailsRequestSchema),
    sendEditDetailsRequest,
  );

router.route("/delete-avatar").delete(deleteAvatar);

export default router;
