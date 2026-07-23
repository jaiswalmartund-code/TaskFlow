import PersonalNote from "../models/PersonalNote.js";

export async function listPersonalNotes(req, res, next) {
  try {
    const notes = await PersonalNote.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
}

export async function createPersonalNote(req, res, next) {
  try {
    const { text, color } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const note = await PersonalNote.create({
      user: req.user._id,
      text: text.trim(),
      color: color || "#FEF9C3",
    });

    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
}

export async function togglePersonalNote(req, res, next) {
  try {
    const note = await PersonalNote.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.completed = !note.completed;
    await note.save();

    res.json({ note });
  } catch (err) {
    next(err);
  }
}

export async function deletePersonalNote(req, res, next) {
  try {
    const note = await PersonalNote.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
}
