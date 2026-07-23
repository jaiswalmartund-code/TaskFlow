import { Router } from "express";
import { listMyInvitations, respondToInvitation } from "../controllers/invitationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", listMyInvitations);
router.post("/:id/respond", respondToInvitation);

export default router;
