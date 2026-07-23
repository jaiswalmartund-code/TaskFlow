import { Router } from "express";
import {
  listPersonalNotes,
  createPersonalNote,
  togglePersonalNote,
  deletePersonalNote,
} from "../controllers/personalNoteController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", listPersonalNotes);
router.post("/", createPersonalNote);
router.patch("/:id/toggle", togglePersonalNote);
router.delete("/:id", deletePersonalNote);

export default router;
