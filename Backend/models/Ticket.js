import mongoose from 'mongoose';
import StatusType from '../../Shared/status.type.js';

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(StatusType),
      default: StatusType.TO_DO,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Optional: Add a field to link to the task if converted
    // convertedToTask: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Task',
    //   default: null,
    // },
    // Optional: Add comments if needed for tickets specifically
    // comments: [
    //   {
    //     text: String,
    //     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     createdAt: { type: Date, default: Date.now },
    //   },
    // ],
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;