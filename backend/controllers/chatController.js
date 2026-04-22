// controllers/chatController.js — AI Chat Logic (FREE APIs)
// Supports: Groq (Llama 3.3) and Google Gemini — both 100% free!

const Chat    = require('../models/Chat');
const Message = require('../models/Message');
const User    = require('../models/User');

// ── Lazy-load AI client based on .env setting ─
// This way you don't need BOTH keys — just one!
let groqClient    = null;
let geminiClient  = null;

const getGroqClient = () => {
  if (!groqClient) {
    const Groq = require('groq-sdk');
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

const getGeminiClient = () => {
  if (!geminiClient) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
};

// ── System prompts per tool ───────────────────
const SYSTEM_PROMPTS = {
  chat:      'You are ARIA, a helpful, friendly, and intelligent AI assistant. Provide clear, accurate, and well-structured responses. Use markdown formatting with **bold**, bullet points, and code blocks where appropriate.',
  summarize: 'You are ARIA, a summarization expert. When given text, produce a concise, well-structured summary. Use bullet points for key takeaways. Start with a one-sentence overview.',
  code:      'You are ARIA, an expert software engineer. Write clean, well-commented, production-ready code. Always specify the programming language. Explain what the code does and how to use it.',
  qa:        'You are ARIA, a precise question-answering assistant. Answer questions directly and accurately. If you are unsure, say so. Keep answers concise but complete.',
};

// ── Call Groq API (FREE — Llama 3.3) ─────────
const callGroq = async (messages, model) => {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 2048,
    temperature: 0.7,
  });
  return {
    content: completion.choices[0].message.content,
    tokens:  completion.usage?.total_tokens || 0,
  };
};

// ── Call Google Gemini API (FREE) ─────────────
const callGemini = async (messages, _model) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  });

  // Gemini uses a different message format — convert from OpenAI format
  const systemMsg  = messages.find(m => m.role === 'system');
  const chatMsgs   = messages.filter(m => m.role !== 'system');

  // Build Gemini history (all but the last user message)
  const history = chatMsgs.slice(0, -1).map(m => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMsg = chatMsgs[chatMsgs.length - 1].content;
  const fullPrompt = systemMsg
    ? `[Instructions: ${systemMsg.content}]\n\n${lastMsg}`
    : lastMsg;

  const chat   = model.startChat({ history });
  const result = await chat.sendMessage(fullPrompt);
  const text   = result.response.text();

  return { content: text, tokens: Math.ceil(text.length / 4) };
};

// ── Unified AI caller — picks provider from .env
const callAI = async (messages, model) => {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();
  if (provider === 'gemini') {
    return await callGemini(messages, model);
  }
  return await callGroq(messages, model);
};

// ─────────────────────────────────────────────
// ROUTE CONTROLLERS
// ─────────────────────────────────────────────

// @route  GET /api/chats
// @desc   Get all chats for current user
// @access Private
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();
    res.json({ success: true, chats });
  } catch (err) { next(err); }
};

// @route  POST /api/chats
// @desc   Create new chat session
// @access Private
const createChat = async (req, res, next) => {
  try {
    const provider = process.env.AI_PROVIDER || 'groq';
    const model    = provider === 'gemini'
      ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash')
      : (process.env.GROQ_MODEL   || 'llama-3.3-70b-versatile');

    const chat = await Chat.create({
      user:  req.user._id,
      title: req.body.title || 'New Chat',
      model,
    });
    res.status(201).json({ success: true, chat });
  } catch (err) { next(err); }
};

// @route  DELETE /api/chats/:id
// @desc   Delete chat + all its messages
// @access Private
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    await Message.deleteMany({ chat: chat._id });
    await chat.deleteOne();
    res.json({ success: true, message: 'Chat deleted' });
  } catch (err) { next(err); }
};

// @route  PUT /api/chats/:id
// @desc   Rename or pin a chat
// @access Private
const updateChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ success: true, chat });
  } catch (err) { next(err); }
};

// @route  GET /api/chats/:id/messages
// @desc   Load all messages in a chat
// @access Private
const getMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    const messages = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, messages, chat });
  } catch (err) { next(err); }
};

// @route  POST /api/chats/:id/messages
// @desc   Send message → get AI response (FREE!)
// @access Private
const sendMessage = async (req, res, next) => {
  try {
    const { content, tool = 'chat', fileUrl, fileText } = req.body;

    // Validate the chat belongs to this user
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Save user message to DB
    const userMessage = await Message.create({
      chat:  chat._id,
      role:  'user',
      content,
      tool,
      ...(fileUrl && { file: { url: fileUrl } }),
    });

    // Get last 20 messages for context (saves tokens)
    const history = await Message.find({ chat: chat._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Build message array for AI — oldest first
    const aiMessages = [
      // System prompt based on selected tool
      { role: 'system', content: SYSTEM_PROMPTS[tool] || SYSTEM_PROMPTS.chat },

      // Conversation history (reversed to chronological order)
      ...history.reverse().slice(0, -1).map(m => ({
        role:    m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),

      // Latest user message (with file text if attached)
      {
        role:    'user',
        content: fileText
          ? `[File content below]\n${fileText}\n\n[My question]: ${content}`
          : content,
      },
    ];

    // ── Call the FREE AI API ──────────────────
    const { content: aiContent, tokens: tokensUsed } = await callAI(aiMessages, chat.model);

    // Save AI response to DB
    const assistantMessage = await Message.create({
      chat:    chat._id,
      role:    'assistant',
      content: aiContent,
      tokens:  tokensUsed,
      tool,
    });

    // Auto-generate chat title from first user message
    const msgCount = await Message.countDocuments({ chat: chat._id });
    const isFirst  = msgCount <= 2;
    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: aiContent.slice(0, 100),
      $inc: { totalTokens: tokensUsed },
      ...(isFirst && chat.title === 'New Chat' && {
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
      }),
    });

    // Update user token count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalTokensUsed: tokensUsed } });

    // Emit to Socket.IO room for real-time updates
    req.io.to(chat._id.toString()).emit('new_message', assistantMessage);

    res.json({ success: true, userMessage, assistantMessage, tokensUsed });

  } catch (err) {
    // User-friendly error messages for common failures
    const msg = err.message || '';
    if (msg.includes('API key') || msg.includes('auth') || err.status === 401) {
      return res.status(500).json({
        message: `Invalid ${process.env.AI_PROVIDER === 'gemini' ? 'Gemini' : 'Groq'} API key. Check your .env file.`,
      });
    }
    if (err.status === 429 || msg.includes('rate limit')) {
      return res.status(429).json({ message: 'Rate limit hit. Wait a moment and try again.' });
    }
    next(err);
  }
};

// @route  GET /api/chats/stats
// @desc   Usage stats for current user
// @access Private
const getStats = async (req, res, next) => {
  try {
    const totalChats    = await Chat.countDocuments({ user: req.user._id });
    const chatIds       = await Chat.find({ user: req.user._id }).distinct('_id');
    const totalMessages = await Message.countDocuments({ chat: { $in: chatIds }, role: 'user' });
    const user          = await User.findById(req.user._id);
    res.json({ success: true, stats: { totalChats, totalMessages, totalTokensUsed: user.totalTokensUsed } });
  } catch (err) { next(err); }
};

module.exports = { getChats, createChat, deleteChat, updateChat, getMessages, sendMessage, getStats };
