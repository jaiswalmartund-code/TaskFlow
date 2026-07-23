import mongoose from "mongoose";

const personalNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    color: { type: String, default: "#FEF9C3" },
  },
  { timestamps: true }
);

export default mongoose.model("PersonalNote", personalNoteSchema);
