import { Router } from "express";
import { updateTask, deleteTask, getUpcomingDeadlines, addRemark, deleteRemark } from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/upcoming", getUpcomingDeadlines);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

router.post("/:taskId/remarks", addRemark);
router.delete("/:taskId/remarks/:remarkId", deleteRemark);

export default router;


