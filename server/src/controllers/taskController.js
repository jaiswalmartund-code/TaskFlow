import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { isMember, getUserRole } from "./projectController.js";

async function assertMembership(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) {
    const err = new Error("Project not found");
    err.statusCode = 404;
    throw err;
  }
  if (!isMember(project, userId)) {
    const err = new Error("You don't have access to this project");
    err.statusCode = 403;
    throw err;
  }
  return project;
}

export async function listTasks(req, res, next) {
  try {
    const project = await assertMembership(req.params.id, req.user._id);
    const role = getUserRole(project, req.user._id);

    const filter = { project: req.params.id };

    // A contributor can ONLY view tasks assigned to them
    if (role === "contributor") {
      filter.assignee = req.user._id;
    } else {
      if (req.query.status) filter.status = req.query.status;
      if (req.query.assignee) filter.assignee = req.query.assignee;
    }

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatarColor")
      .populate("createdBy", "name email avatarColor")
      .populate("remarks.author", "name email avatarColor")
      .sort({ createdAt: -1 });

    res.json({ tasks, userRole: role });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const project = await assertMembership(req.params.id, req.user._id);
    const role = getUserRole(project, req.user._id);

    if (role === "contributor") {
      return res.status(403).json({ message: "Contributors cannot create tasks. Only Product Managers can create tasks." });
    }

    const { title, description, status, priority, assignee, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required" });

    const task = await Task.create({
      project: req.params.id,
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "remarks.author", select: "name email avatarColor" },
    ]);

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const project = await assertMembership(task.project, req.user._id);
    const role = getUserRole(project, req.user._id);

    if (role === "contributor") {
      const isAssigned = task.assignee && task.assignee.toString() === req.user._id.toString();
      if (!isAssigned) {
        return res.status(403).json({ message: "Contributors can only update tasks assigned to them." });
      }

      if (req.body.status !== undefined) {
        task.status = req.body.status;
      }
    } else {
      const fields = ["title", "description", "status", "priority", "assignee", "dueDate"];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) task[f] = req.body[f] || null;
      });
    }

    await task.save();

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "remarks.author", select: "name email avatarColor" },
    ]);

    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const project = await assertMembership(task.project, req.user._id);
    const role = getUserRole(project, req.user._id);

    if (role === "contributor") {
      return res.status(403).json({ message: "Contributors cannot delete tasks." });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
}

export async function addRemark(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await assertMembership(task.project, req.user._id);

    const { text, color } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Sticky note text is required" });
    }

    task.remarks.push({
      text: text.trim(),
      color: color || "#FEF9C3",
      author: req.user._id,
    });

    await task.save();

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "remarks.author", select: "name email avatarColor" },
    ]);

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
}

export async function deleteRemark(req, res, next) {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await assertMembership(task.project, req.user._id);

    task.remarks = task.remarks.filter(
      (r) => r._id.toString() !== req.params.remarkId
    );

    await task.save();

    const populated = await task.populate([
      { path: "assignee", select: "name email avatarColor" },
      { path: "createdBy", select: "name email avatarColor" },
      { path: "remarks.author", select: "name email avatarColor" },
    ]);

    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
}

export async function getUpcomingDeadlines(req, res, next) {
  try {
    const userProjects = await Project.find({ "members.user": req.user._id }).select("_id");
    const projectIds = userProjects.map((p) => p._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $ne: null },
      status: { $ne: "done" },
    })
      .populate("project", "name color")
      .sort({ dueDate: 1 })
      .limit(6);

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}
