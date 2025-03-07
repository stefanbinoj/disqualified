import React, { useState } from "react";
import Header from "./components/Header";
import { Mail, Circle, CheckCircle2, ArrowLeft, Calendar, Clock } from "lucide-react";

// Sample messages data
const messages = [
  {
    id: 1,
    subject: "Interview Invitation - Electrician Position at City Maintenance",
    sender: "City Maintenance Services",
    preview: "We are interested in your application for the Electrician position...",
    timestamp: "2024-02-20T10:30:00",
    read: false,
    type: "interview",
    fullMessage: `Dear Candidate,

We are interested in your application for the Electrician position at City Maintenance Services. We would like to invite you for an in-person interview.

Interview Details:
- Date: February 22, 2024
- Time: 10:00 AM
- Location: City Maintenance Office, Near Central Market
- Expected Duration: 30 minutes

Please bring your:
- ID proof
- Previous work certificates
- Tool kit (if you have one)

Please confirm if this time works for you.

Best regards,
HR Team
City Maintenance Services`
  },
  {
    id: 2,
    subject: "Job Offer - Plumbing Work at Green Apartments",
    sender: "Green Apartments Association",
    preview: "Based on your experience, we would like to offer you regular maintenance work...",
    timestamp: "2024-02-19T15:45:00",
    read: true,
    type: "offer",
    fullMessage: `Dear Sir,

We are looking for a regular plumber for our apartment complex. The work includes:

- Weekly maintenance checks
- Emergency repairs
- Pipeline inspection

Payment: Rs. 15,000 per month
Working hours: 4 hours daily (morning)
Location: Green Apartments, Kochi

If interested, please call us at 9876543210.

Regards,
Secretary
Green Apartments`
  },
  {
    id: 3,
    subject: "Status Update - Carpenter Position at Home Solutions",
    sender: "Home Solutions",
    preview: "Thank you for your interest. We have filled the position...",
    timestamp: "2024-02-18T09:15:00",
    read: true,
    type: "rejection",
    fullMessage: `Dear Applicant,

Thank you for applying to the Carpenter position at Home Solutions.

We appreciate your interest, but we have selected another candidate whose experience better matches our current requirements.

We will keep your application for future opportunities.

Best regards,
Home Solutions Team`
  },
  {
    id: 4,
    subject: "Urgent Need - AC Technician for Hotel",
    sender: "Royal Palace Hotel",
    preview: "We need an experienced AC technician for immediate joining...",
    timestamp: "2024-02-17T14:20:00",
    read: false,
    type: "offer",
    fullMessage: `Dear AC Technician,

We urgently need an experienced AC technician for our hotel property.

Job Details:
- Full-time position
- Salary: Rs. 22,000 - 25,000 per month
- Accommodation provided
- Food provided during duty hours
- Experience: 2+ years required

Responsibilities:
- Regular maintenance of AC units
- Emergency repairs
- Monthly inspection reports

Please call our Maintenance Manager at 9876543211 for immediate interview.

Regards,
HR Department
Royal Palace Hotel`
  },
  {
    id: 5,
    subject: "Interview Result - Security Guard Position",
    sender: "SafeGuard Security Services",
    preview: "Congratulations! We are pleased to inform you...",
    timestamp: "2024-02-16T11:15:00",
    read: false,
    type: "offer",
    fullMessage: `Dear Candidate,

Congratulations! We are pleased to inform you that you have been selected for the position of Security Guard.

Job Details:
- Location: Tech Park, Kakkanad
- Shift: Night (8 PM - 8 AM)
- Salary: Rs. 14,000 per month
- Additional benefits: ESI, PF
- Weekly off: Sunday

Please report to our office tomorrow with:
1. Original ID proof
2. 2 passport size photos
3. Previous experience certificate (if any)

Contact: 9876543212

Best regards,
HR Team
SafeGuard Security Services`
  },
  {
    id: 6,
    subject: "Part-time Cooking Opportunity - Weekend Only",
    sender: "Happy Homes Old Age Care",
    preview: "Looking for an experienced cook for weekend duties...",
    timestamp: "2024-02-15T09:30:00",
    read: true,
    type: "interview",
    fullMessage: `Dear Cook,

We are looking for an experienced cook for our old age home for weekend duties.

Requirements:
- Experience in preparing Kerala cuisine
- Clean and hygienic cooking practices
- Ability to prepare special dishes for diabetic patients

Work Schedule:
- Saturday and Sunday only
- 7 AM to 7 PM
- Rs. 1,000 per day

Interview Details:
Date: Tomorrow
Time: 10 AM
Location: Happy Homes, Near General Hospital

Please bring your ID proof and any cooking experience certificates.

Thanks,
Manager
Happy Homes Old Age Care`
  },
  {
    id: 7,
    subject: "Driver Position Update - School Bus",
    sender: "Little Flowers Public School",
    preview: "Thank you for attending the interview for the position of School Bus Driver...",
    timestamp: "2024-02-14T16:45:00",
    read: true,
    type: "rejection",
    fullMessage: `Dear Applicant,

Thank you for attending the interview for the position of School Bus Driver.

While your experience is valuable, we require someone with specific experience in school bus operations. We will keep your application on file for future opportunities.

We wish you success in your job search.

Regards,
Transport Department
Little Flowers Public School`
  },
  {
    id: 8,
    subject: "Gardener Required - Immediate Joining",
    sender: "Green Valley Apartments",
    preview: "We are looking for a full-time gardener for our apartment complex...",
    timestamp: "2024-02-13T10:00:00",
    read: true,
    type: "offer",
    fullMessage: `Dear Sir/Madam,

We are looking for a full-time gardener for our apartment complex.

Job Requirements:
- Experience in garden maintenance
- Knowledge of plants and seasonal flowers
- Basic tools will be provided
- Working hours: 8 AM to 5 PM
- Salary: Rs. 12,000 per month

Benefits:
- Monthly bonus for extra work
- Festival bonus
- Sunday off

If interested, please visit our apartment office between 10 AM to 4 PM.

Contact: 9876543213

Thanks,
Secretary
Green Valley Apartments`
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
                      message.type === 'offer' ? 'text-green-500' :
                      message.type === 'rejection' ? 'text-red-500' :
                      'text-blue-500'
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
