// models/Chat.js — Chat Session Schema
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    // The owner of this chat session
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Auto-generated or user-edited title
    title: {
      type: String,
      default: 'New Chat',
      maxlength: [100, 'Title too long'],
    },
    // Pinned chats appear at the top of the sidebar
    isPinned: {
      type: Boolean,
      default: false,
    },
    // The AI model used for this chat
    model: {
      type: String,
      default: 'gpt-4o-mini',
    },
    // Total tokens consumed in this chat
    totalTokens: {
      type: Number,
      default: 0,
    },
    // Last message preview for sidebar display
    lastMessage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index so we can quickly fetch all chats for a user, newest first
chatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
