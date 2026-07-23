import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";

// helper: extract string ID from ObjectId, string, or populated doc
function getId(val) {
  if (!val) return "";
  if (typeof val === "object" && val._id) return val._id.toString();
  return val.toString();
}

// helper: is this user a member (any role) of the project?
function isMember(project, userId) {
  if (!project || !project.members || !userId) return false;
  const targetId = getId(userId);
  return project.members.some((m) => m && m.user && getId(m.user) === targetId);
}

function isOwner(project, userId) {
  if (!project || !project.owner || !userId) return false;
  return getId(project.owner) === getId(userId);
}

function getUserRole(project, userId) {
  if (!project || !userId) return "contributor";
  const targetId = getId(userId);
  if (getId(project.owner) === targetId) return "owner";
  const member = project.members.find((m) => m && m.user && getId(m.user) === targetId);
  return member ? (member.role || "contributor") : "contributor";
}


export async function listProjects(req, res, next) {
  try {
    const projects = await Project.find({ "members.user": req.user._id })
      .populate("owner", "name email avatarColor")
      .populate("members.user", "name email avatarColor")
      .sort({ updatedAt: -1 });

    const projectIds = projects.map((p) => p._id);
    const taskStats = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: "$project",
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        },
      },
    ]);

    const statsMap = {};
    taskStats.forEach((s) => {
      statsMap[s._id.toString()] = s;
    });

    const projectsWithProgress = projects.map((p) => {
      const plain = p.toObject();
      const stat = statsMap[p._id.toString()] || { total: 0, done: 0 };
      plain.totalTasks = stat.total;
      plain.completedTasks = stat.done;
      // If tasks exist, calculate percentage; otherwise default to 0 (or mock default for new empty projects)
      plain.progress = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : (plain.progress || 0);
      return plain;
    });

    res.json({ projects: projectsWithProgress });
  } catch (err) {
    next(err);
  }
}


export async function createProject(req, res, next) {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor" },
      { path: "members.user", select: "name email avatarColor" },
    ]);

    res.status(201).json({ project: populated });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatarColor")
      .populate("members.user", "name email avatarColor");

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!isMember(project, req.user._id)) {
      return res.status(403).json({ message: "You don't have access to this project" });
    }

    const userRole = getUserRole(project, req.user._id);

    const taskCounts = await Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({ project, taskCounts, userRole });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!isOwner(project, req.user._id)) {
      return res.status(403).json({ message: "Only the project owner can edit project details" });
    }

    const { name, description, color } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (color !== undefined) project.color = color;
    await project.save();

    const populated = await project.populate([
      { path: "owner", select: "name email avatarColor" },
      { path: "members.user", select: "name email avatarColor" },
    ]);

    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const ownerMatch = project.owner && project.owner.toString() === req.user._id.toString();
    const role = getUserRole(project, req.user._id);
    const canDelete = ownerMatch || role === "owner" || role === "manager";

    if (!canDelete) {
      return res.status(403).json({ message: "Only the project owner or product manager can delete this project" });
    }

    await Task.deleteMany({ project: project._id });
    await Invitation.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
}



export async function addMember(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const callerRole = getUserRole(project, req.user._id);
    if (callerRole !== "owner" && callerRole !== "manager") {
      return res.status(403).json({ message: "Only a Product Manager or Project Owner can send invitations" });
    }

    const { email, role } = req.body;
    const targetRole = role === "manager" ? "manager" : "contributor";

    const invited = await User.findOne({ email: (email || "").toLowerCase() });
    if (!invited) {
      return res.status(404).json({ message: "No account found with that email" });
    }
    if (isMember(project, invited._id)) {
      return res.status(409).json({ message: "That person is already a member of this project" });
    }

    const existingInvite = await Invitation.findOne({
      project: project._id,
      invitee: invited._id,
      status: "pending",
    });
    if (existingInvite) {
      return res.status(409).json({ message: "An invitation request has already been sent to this user profile" });
    }

    await Invitation.create({
      project: project._id,
      inviter: req.user._id,
      invitee: invited._id,
      role: targetRole,
      status: "pending",
    });

    res.json({ message: `Invitation request sent to ${invited.name}` });
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const callerRole = getUserRole(project, req.user._id);
    if (callerRole !== "owner" && callerRole !== "manager") {
      return res.status(403).json({ message: "Only a Product Manager or Project Owner can remove members" });
    }

    if (req.params.userId === getId(project.owner)) {
      return res.status(400).json({ message: "The owner can't be removed from the project" });
    }

    project.members = project.members.filter(
      (m) => getId(m.user) !== req.params.userId
    );
    await project.save();

    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
}

export { isMember, isOwner, getUserRole };


