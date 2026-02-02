import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
