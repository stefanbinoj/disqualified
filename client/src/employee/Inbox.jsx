import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Circle, CheckCircle2, ArrowLeft, Calendar, Clock } from "lucide-react";
import axiosWithHeader from "../axiosWithHeaders"; // Adjust this path as needed
import Loader from "../components/Loader"; // Create or import this component

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [readMessages, setReadMessages] = useState(new Set());

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const response = await axiosWithHeader.get("/users/inbox");
      if (response.data.success) {
        setMessages(response.data.inbox);

        // Initialize read messages set
        const readMsgs = new Set();
        response.data.inbox.forEach((msg) => {
          if (msg.read) readMsgs.add(msg._id);
        });
        setReadMessages(readMsgs);
      }
    } catch (err) {
      setError(
        "Failed to fetch inbox messages: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Inbox fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);

    // If message is not already marked as read
    if (!readMessages.has(message._id)) {
      try {
        // Optimistically update UI
        setReadMessages((prev) => new Set([...prev, message._id]));

        // Update in backend (assuming an endpoint exists to mark messages as read)
        // This endpoint would need to be implemented on the backend
        // await axiosWithHeader.patch(`/api/users/inbox/${message._id}/read`, { read: true });
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
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

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex bg-white pt-14 max-h-[calc(100vh-3.5rem)]">
        {!selectedMessage ? (
          // Messages List
          <div className="w-full overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Your inbox is empty
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((message) => (
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
                          message.type === "offer"
                            ? "text-green-500"
                            : message.type === "rejection"
                            ? "text-red-500"
                            : "text-blue-500"
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
                            {message.subject}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {message.sender}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {message.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <h2 className="text-xl font-semibold">
                {selectedMessage.subject}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{selectedMessage.sender}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedMessage.timestamp).toLocaleDateString(
                    "en-IN"
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedMessage.timestamp).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>
              <div className="mt-6 text-gray-600 whitespace-pre-line">
                {selectedMessage.fullMessage}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
