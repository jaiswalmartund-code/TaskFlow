import { Router } from "express";
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import {
  listTasks,
  createTask,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:id", getProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

router.get("/:id/tasks", listTasks);
router.post("/:id/tasks", createTask);

export default router;
