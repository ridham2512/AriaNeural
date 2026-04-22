// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const {
  getChats,
  createChat,
  deleteChat,
  updateChat,
  getMessages,
  sendMessage,
  getStats,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(protect);

router.route('/').get(getChats).post(createChat);
router.get('/stats', getStats);
router.route('/:id').put(updateChat).delete(deleteChat);
router.route('/:id/messages').get(getMessages).post(sendMessage);

module.exports = router;
