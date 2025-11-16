import mongoose from "mongoose";

export const outboxSchema = new mongoose.Schema(
  {
    for: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["c", "u", "d"],
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    actor: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
    },
    from: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    lastError: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

outboxSchema.index({ status: 1, createdAt: 1 });

const Outbox = mongoose.models.Outbox || mongoose.model("Outbox", outboxSchema);

export default Outbox;
