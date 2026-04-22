// src/hooks/useChat.js — Chat state and actions
import { useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useChat = () => {
  const [chats, setChats]         = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);

  // ── Fetch all chat sessions ───────────────────
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/chats');
      setChats(data.chats);
    } catch {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Open a chat and load its messages ─────────
  const openChat = useCallback(async (chat) => {
    try {
      setActiveChat(chat);
      setMessages([]);
      setLoading(true);
      const { data } = await api.get(`/chats/${chat._id}/messages`);
      setMessages(data.messages);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Create a new chat session ─────────────────
  const createChat = useCallback(async () => {
    try {
      const { data } = await api.post('/chats', { title: 'New Chat' });
      setChats((prev) => [data.chat, ...prev]);
      await openChat(data.chat);
      return data.chat;
    } catch {
      toast.error('Failed to create chat');
    }
  }, [openChat]);

  // ── Delete a chat ─────────────────────────────
  const deleteChat = useCallback(async (chatId) => {
    try {
      await api.delete(`/chats/${chatId}`);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete chat');
    }
  }, [activeChat]);

  // ── Rename a chat ─────────────────────────────
  const renameChat = useCallback(async (chatId, title) => {
    try {
      const { data } = await api.put(`/chats/${chatId}`, { title });
      setChats((prev) => prev.map((c) => (c._id === chatId ? data.chat : c)));
      if (activeChat?._id === chatId) setActiveChat(data.chat);
    } catch {
      toast.error('Failed to rename chat');
    }
  }, [activeChat]);

  // ── Send a message ────────────────────────────
  const sendMessage = useCallback(async (content, tool = 'chat', fileData = null) => {
    if (!activeChat || !content.trim()) return;
    setSending(true);

    // Optimistic UI: show user message immediately
    const tempUserMsg = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const payload = {
        content,
        tool,
        ...(fileData?.url  && { fileUrl: fileData.url }),
        ...(fileData?.text && { fileText: fileData.text }),
      };
      const { data } = await api.post(`/chats/${activeChat._id}/messages`, payload);

      // Replace temp message with real one + add assistant reply
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUserMsg._id),
        data.userMessage,
        data.assistantMessage,
      ]);

      // Update chat title in sidebar if it was auto-renamed
      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChat._id
            ? { ...c, lastMessage: data.assistantMessage.content.slice(0, 80) }
            : c
        )
      );
    } catch (err) {
      // Remove temp message on failure
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }, [activeChat]);

  return {
    chats, activeChat, messages, loading, sending,
    fetchChats, openChat, createChat, deleteChat, renameChat, sendMessage,
    setChats, setMessages,
  };
};
