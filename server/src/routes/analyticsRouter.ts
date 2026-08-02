import { Router } from "express";
const router = Router();
import {
  getAdminDashboard,
  getCoreDistributionAnalytics,
  getPerformanceAndQualityAnalytics,
  getAiImpactAnalytics,
} from "../controllers/analyticsController";

router.route("/dashboard").get(getAdminDashboard);
router.route("/distribution").get(getCoreDistributionAnalytics);
router.route("/performance").get(getPerformanceAndQualityAnalytics);
router.route("/ai-impact").get(getAiImpactAnalytics);

export default router;
