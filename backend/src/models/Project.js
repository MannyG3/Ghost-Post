const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ["github", "docs"],
      default: "github",
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    docsUrl: {
      type: String,
      trim: true,
    },
    defaultPlatform: {
      type: String,
      enum: ["linkedin", "twitter", "both"],
      default: "both",
    },
    lastGeneratedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);