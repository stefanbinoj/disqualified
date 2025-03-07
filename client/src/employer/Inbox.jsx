import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Mail, Circle, CheckCircle2, ArrowLeft, Calendar, Clock } from "lucide-react";

// Sample employer messages data
const messages = [
  {
    id: 1,
    subject: "Application Received - Electrician Position",
    sender: "Rahul Kumar",
    preview: "I am interested in the Electrician position at your company...",
    timestamp: "2024-02-20T10:30:00",
    read: false,
    type: "application",
    fullMessage: `Dear Hiring Manager,

I am writing to express my interest in the Electrician position at your company.

Experience:
- 5 years as residential electrician
- 3 years industrial experience
- Licensed electrician
- Expertise in electrical maintenance and repairs

Skills:
- Circuit installation and maintenance
- Troubleshooting electrical issues
- Reading electrical blueprints
- Safety protocol compliance

Available to start immediately. References available upon request.

Best regards,
Rahul Kumar
Contact: 9876543210`
  },
  {
    id: 2,
    subject: "Interview Confirmation - Plumber Position",
    sender: "Suresh M",
    preview: "Thank you for the interview invitation. I confirm my attendance...",
    timestamp: "2024-02-19T15:45:00",
    read: true,
    type: "confirmation",
    fullMessage: `Dear Sir/Madam,

I confirm my attendance for the plumber position interview scheduled for tomorrow at 10:00 AM.

I will bring all the required documents as mentioned:
- ID proof
- Experience certificates
- Tool kit

Looking forward to meeting you.

Thank you,
Suresh M
Contact: 9876543211`
  },
  {
    id: 3,
    subject: "Job Application - Security Guard",
    sender: "Abdul Rahman",
    preview: "Applying for the night shift security guard position...",
    timestamp: "2024-02-18T09:15:00",
    read: true,
    type: "application",
    fullMessage: `Dear Employer,

I am applying for the night shift security guard position.

Experience:
- 8 years in security services
- Ex-military personnel
- Trained in first aid
- Experience with CCTV monitoring

Available for night shifts.
Can join immediately.
Salary expectation: As per company norms

Regards,
Abdul Rahman
Contact: 9876543212`
  },
  {
    id: 4,
    subject: "Application Update - Cook Position",
    sender: "Mary Thomas",
    preview: "Following up on my application for the cook position...",
    timestamp: "2024-02-17T14:20:00",
    read: false,
    type: "followup",
    fullMessage: `Dear Sir/Madam,

I am following up on my application for the cook position submitted last week.

I have 10 years of experience in:
- Kerala cuisine
- North Indian dishes
- Chinese cuisine
- Bulk cooking for events

Available for a cooking demonstration if required.

Best regards,
Mary Thomas
Contact: 9876543213`
  },
  {
    id: 5,
    subject: "Interview Reschedule Request",
    sender: "Vijay S",
    preview: "Request to reschedule tomorrow's driver interview...",
    timestamp: "2024-02-16T11:15:00",
    read: false,
    type: "reschedule",
    fullMessage: `Dear Hiring Team,

I request to reschedule tomorrow's driver interview due to a medical emergency.

I would be available any time next week at your convenience.

Sorry for the inconvenience.

Regards,
Vijay S
Contact: 9876543214`
  }
];

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [readMessages, setReadMessages] = useState(new Set(messages.filter(m => m.read).map(m => m.id)));

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!readMessages.has(message.id)) {
      setReadMessages(prev => new Set([...prev, message.id]));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex bg-white pt-14 max-h-[calc(100vh-3.5rem)]">
        {!selectedMessage ? (
          // Messages List
          <div className="w-full overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !readMessages.has(message.id) ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${
                      message.type === 'application' ? 'text-blue-500' :
                      message.type === 'confirmation' ? 'text-green-500' :
                      message.type === 'reschedule' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {!readMessages.has(message.id) ? <Circle className="w-4 h-4 fill-current" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium ${!readMessages.has(message.id) ? 'text-black' : 'text-gray-600'}`}>
                          {message.subject}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{message.sender}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
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
              <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{selectedMessage.sender}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedMessage.timestamp).toLocaleDateString('en-IN')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedMessage.timestamp).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
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
