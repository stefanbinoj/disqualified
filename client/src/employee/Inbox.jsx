import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import api from "../axiosWithHeaders";
import { formatDistanceToNow } from "date-fns";
import {
  Mail,
  Circle,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Clock,
} from "lucide-react";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [readMessages, setReadMessages] = useState(new Set());

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await api.get("/messages/inbox");
        setMessages(response.data.data);

        // Initialize read messages set
        const readMsgs = new Set(
          response.data.data.filter((msg) => msg.isRead).map((msg) => msg._id)
        );
        setReadMessages(readMsgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const markAsRead = async (messageId) => {
    try {
      await api.patch(`/messages/${messageId}/read`);

      // Update local state
      setReadMessages((prev) => new Set([...prev, messageId]));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);

    // Mark as read if it isn't already
    if (!readMessages.has(message._id)) {
      markAsRead(message._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex bg-white pt-14 max-h-[calc(100vh-3.5rem)]">
        {!selectedMessage ? (
          // Messages List
          <div className="w-full overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Your inbox is empty.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !readMessages.has(message._id) ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 ${
                          message.type === "application"
                            ? "text-blue-500"
                            : message.type === "confirmation"
                            ? "text-green-500"
                            : message.type === "reschedule"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {!readMessages.has(message._id) ? (
                          <Circle className="w-4 h-4 fill-current" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3
                            className={`font-medium ${
                              !readMessages.has(message._id)
                                ? "text-black"
                                : "text-gray-600"
                            }`}
                          >
                            {message.title}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {message.senderId.firstName}{" "}
                          {message.senderId.lastName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // Message Detail View
          <div className="w-full overflow-y-auto">
            <div className="border-b border-gray-100 sticky top-0 bg-white">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-black p-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Inbox</span>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{selectedMessage.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>
                  {selectedMessage.senderId.firstName}{" "}
                  {selectedMessage.senderId.lastName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    "en-IN"
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedMessage.createdAt).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>
              {selectedMessage.jobId && (
                <div className="mt-2 text-sm text-gray-500">
                  Job: {selectedMessage.jobId.title} -{" "}
                  {selectedMessage.jobId.position}
                </div>
              )}
              <div className="mt-6 text-gray-600 whitespace-pre-line">
                {selectedMessage.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
