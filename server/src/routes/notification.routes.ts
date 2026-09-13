import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";
const router = Router();

router.route("/").get(getUserNotifications);
router.route("/read-all").patch(markAllAsRead);
router.route("/:id/read").patch(markAsRead);

export default router;
