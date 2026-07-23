import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import Invitation from "./models/Invitation.js";
import PersonalNote from "./models/PersonalNote.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow";

export async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    // Clear existing data
    console.log("Clearing existing database collections...");
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Invitation.deleteMany({}),
      PersonalNote.deleteMany({}),
    ]);

    console.log("Creating default users (Default password: password123)...");
    const defaultPasswordHash = await bcrypt.hash("password123", 10);

    const userMartund = await User.create({
      _id: "6a61fecefb6e1f0642310082",
      name: "Martund Jaiswal",
      email: "martund@gmail.com",
      passwordHash: defaultPasswordHash,
      avatarColor: "#7A6B9E",
    });

    const userGauri = await User.create({
      _id: "6a62063b40c6e9543f33ab2e",
      name: "gauri vashistha",
      email: "gauri@server.com",
      passwordHash: defaultPasswordHash,
      avatarColor: "#3F6659",
    });

    const userMahii = await User.create({
      _id: "6a6285aec8bf7231bdf11767",
      name: "mahii",
      email: "mahii@gmail.com",
      passwordHash: defaultPasswordHash,
      avatarColor: "#3F6659",
    });

    console.log("Creating projects...");
    const projectOneCampus = await Project.create({
      _id: "6a61fefbfb6e1f0642310087",
      name: "OneCampus",
      description: "one stop solution for college students and professors ",
      color: "#E2A33D",
      owner: userMartund._id,
      members: [
        { user: userMartund._id, role: "owner" },
        { user: userGauri._id, role: "member" },
      ],
    });

    const projectHype = await Project.create({
      _id: "6a6212db1d9654277d09c466",
      name: "HYPE",
      description: "e-comm website with real creators and reviews",
      color: "#D96C5F",
      owner: userMartund._id,
      members: [
        { user: userMartund._id, role: "owner" },
        { user: userGauri._id, role: "member" },
      ],
    });

    const projectCrisis = await Project.create({
      _id: "6a6214241d9654277d09c492",
      name: "Rapid Crisis Response System",
      description: "A platform to response rapidly to all the emergencies efficiently in the hospitality sector",
      color: "#7A6B9E",
      owner: userMartund._id,
      members: [
        { user: userMartund._id, role: "owner" },
        { user: userGauri._id, role: "contributor" },
      ],
    });

    console.log("Creating tasks...");
    await Task.create([
      {
        _id: "6a6214b353185d525dfc7360",
        project: projectOneCampus._id,
        title: "Campus Event Announcement Notifications",
        description: "Add notification banner and push alerts for upcoming campus events.",
        status: "done",
        priority: "low",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7361",
        project: projectHype._id,
        title: "Creator Video Review Feed",
        description: "Integrate video feed components for creator reviews on product detail pages.",
        status: "todo",
        priority: "high",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7362",
        project: projectHype._id,
        title: "E-Commerce Checkout & Payment Gateway",
        description: "Setup Stripe & UPI payment gateways for seamless order checkout.",
        status: "done",
        priority: "high",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7363",
        project: projectHype._id,
        title: "Product Recommendation Engine",
        description: "Build recommendation algorithms based on creator reviews and product ratings.",
        status: "done",
        priority: "medium",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7364",
        project: projectHype._id,
        title: "Creator Dashboard & Analytics",
        description: "Provide creators with earnings dashboard and review conversion metrics.",
        status: "done",
        priority: "medium",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7365",
        project: projectCrisis._id,
        title: "Hospitality Emergency SOS Alerting System",
        description: "Implement instant 1-tap SOS alert dispatch for hotel staff and emergency services.",
        status: "in_progress",
        priority: "high",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7366",
        project: projectCrisis._id,
        title: "Real-time Location Tracking & Dispatch",
        description: "Integrate WebSockets & GeoJSON map to track crisis responder locations live.",
        status: "done",
        priority: "high",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7367",
        project: projectCrisis._id,
        title: "Staff Incident Reporting Workflow",
        description: "Create digitized incident forms for recording safety hazards and resolution logs.",
        status: "done",
        priority: "medium",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
      {
        _id: "6a6214b353185d525dfc7368",
        project: projectCrisis._id,
        title: "Hospitality Safety Compliance Audit",
        description: "Generate automated safety compliance reports for hotel management.",
        status: "in_progress",
        priority: "low",
        assignee: userMartund._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdBy: userMartund._id,
      },
    ]);

    console.log("Creating invitations...");
    await Invitation.create({
      _id: "6a6218a27265ee2593fe74e9",
      project: projectCrisis._id,
      inviter: userMartund._id,
      invitee: userGauri._id,
      role: "contributor",
      status: "accepted",
    });

    console.log("Creating personal notes...");
    await PersonalNote.create([
      {
        user: userMartund._id,
        text: "Prepare weekly project roadmap presentation for stakeholders",
        completed: false,
        color: "#FEF9C3",
      },
      {
        user: userMartund._id,
        text: "Review team pull requests for Rapid Crisis Response System",
        completed: true,
        color: "#DCFCE7",
      },
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

// Execute directly if run via CLI
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  seedDatabase();
}
