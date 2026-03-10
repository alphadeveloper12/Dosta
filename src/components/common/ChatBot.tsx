import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Bot, Loader2 } from "lucide-react";
import { sendChatMessage } from "@/services/chatService";

interface Message {
 role: "user" | "bot";
 content: string;
}

const ChatBot = () => {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([
  {
   role: "bot",
   content: "Hello! I'm Dosta's AI assistant. How can I help you today?",
  },
 ]);
 const [input, setInput] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 useEffect(() => {
  scrollToBottom();
 }, [messages, isOpen]);

 // Listen for custom event to open
 useEffect(() => {
  const handleOpenChat = () => setIsOpen(true);
  window.addEventListener("open-chatbot", handleOpenChat);
  return () => window.removeEventListener("open-chatbot", handleOpenChat);
 }, []);

 const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setInput("");
  setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
  setIsLoading(true);

  try {
   const reply = await sendChatMessage(userMessage);
   setMessages((prev) => [...prev, { role: "bot", content: reply }]);
  } catch (error) {
   setMessages((prev) => [
    ...prev,
    {
     role: "bot",
     content:
      "Sorry, I'm having trouble connecting right now. Please try again later.",
    },
   ]);
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <div className="fixed bottom-6 right-6 max-md:bottom-[100px] max-md:right-4 z-[9999]">
   <AnimatePresence>
    {isOpen && (
     <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="flex flex-col w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[20px] shadow-2xl border border-neutral-gray-light overflow-hidden mb-4">
      {/* Header */}
      <div className="bg-[#054A86] p-4 flex items-center justify-between text-white">
       <div className="flex items-center gap-2">
        <div className="p-1.5 bg-white/20 rounded-lg">
         <Bot size={20} />
        </div>
        <div>
         <h3 className="font-bold text-[16px]">Dosta Assistant</h3>
         <p className="text-[12px] opacity-80">Online | Sales & Service</p>
        </div>
       </div>
       <button
        onClick={() => setIsOpen(false)}
        className="p-1 hover:bg-white/20 rounded-full transition-colors">
        <X size={20} />
       </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-gray-lightest/30">
       {messages.map((msg, idx) => (
        <div
         key={idx}
         className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
         <div
          className={`flex gap-2 max-w-[85%] ${
           msg.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}>
          <div
           className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            msg.role === "user" ? "bg-primary-light" : "bg-[#054A86] text-white"
           }`}>
           {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div
           className={`p-3 rounded-[16px] text-[14px] leading-[1.4] shadow-sm ${
            msg.role === "user"
             ? "bg-primary-dark text-white rounded-tr-none"
             : "bg-white text-neutral-black rounded-tl-none border border-neutral-gray-light"
           }`}>
           {msg.content}
          </div>
         </div>
        </div>
       ))}
       {isLoading && (
        <div className="flex justify-start">
         <div className="flex gap-2 items-center bg-white border border-neutral-gray-light p-3 rounded-[16px] rounded-tl-none shadow-sm">
          <img src="/animated-icon.svg" alt="Thinking..." className="w-4 h-4" />
          <span className="text-[14px] text-neutral-gray italic">
           Thinking...
          </span>
         </div>
        </div>
       )}
       <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-gray-light bg-white">
       <form
        onSubmit={(e) => {
         e.preventDefault();
         handleSend();
        }}
        className="flex items-center gap-2">
        <input
         type="text"
         value={input}
         onChange={(e) => setInput(e.target.value)}
         placeholder="Type your message..."
         className="flex-1 p-2 bg-neutral-gray-lightest rounded-[12px] text-[14px] outline-none focus:ring-1 focus:ring-[#054A86]"
        />
        <button
         type="submit"
         disabled={!input.trim() || isLoading}
         className="p-2 bg-[#054A86] text-white rounded-[12px] disabled:opacity-50 transition-opacity">
         <Send size={18} />
        </button>
       </form>
      </div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Floating Toggle Button */}
   <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsOpen(!isOpen)}
    className="w-[60px] h-[60px] bg-[#054A86] text-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group">
    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
   </motion.button>
  </div>
 );
};

export default ChatBot;
