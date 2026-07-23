import Invitation from "../models/Invitation.js";
import Project from "../models/Project.js";

export async function listMyInvitations(req, res, next) {
  try {
    const invitations = await Invitation.find({
      invitee: req.user._id,
      status: "pending",
    })
      .populate("project", "name color description")
      .populate("inviter", "name email avatarColor")
      .sort({ createdAt: -1 });

    res.json({ invitations });
  } catch (err) {
    next(err);
  }
}

export async function respondToInvitation(req, res, next) {
  try {
    const { action } = req.body; // 'accept' or 'decline'
    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be accept or decline." });
    }

    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation request not found" });
    }

    if (invitation.invitee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to respond to this invitation" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: `Invitation is already ${invitation.status}` });
    }

    if (action === "accept") {
      invitation.status = "accepted";
      await invitation.save();

      // Add user to project members
      const project = await Project.findById(invitation.project);
      if (project) {
        const isAlreadyMember = project.members.some(
          (m) => (m.user._id ? m.user._id.toString() : m.user.toString()) === req.user._id.toString()
        );
        if (!isAlreadyMember) {
          project.members.push({ user: req.user._id, role: invitation.role });
          await project.save();
        }
      }
      res.json({ message: "Invitation accepted", invitation });
    } else {
      invitation.status = "declined";
      await invitation.save();
      res.json({ message: "Invitation declined", invitation });
    }
  } catch (err) {
    next(err);
  }
}
