import React, { createContext, useContext, useState } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { askAIAssistant } from '@/services/aiService';

interface AIAssistantContextType {
  isOpen: boolean;
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  toggleAIAssistant: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType>({
  isOpen: false,
  openAIAssistant: () => {},
  closeAIAssistant: () => {},
  toggleAIAssistant: () => {},
});

export const useAIAssistant = () => useContext(AIAssistantContext);

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your AI Resume & Career Coach powered by Groq. Ask me anything about your resume, ATS optimization, or interview preparation!",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  const openAIAssistant = () => setIsOpen(true);
  const closeAIAssistant = () => setIsOpen(false);
  const toggleAIAssistant = () => setIsOpen((prev) => !prev);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsSendingChat(true);

    try {
      const reply = await askAIAssistant(userMsg);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Sorry, I couldn't process your request right now. Please try again!" },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <AIAssistantContext.Provider value={{ isOpen, openAIAssistant, closeAIAssistant, toggleAIAssistant }}>
      {children}

      {/* Global AI Assistant Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={closeAIAssistant}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#051C36] px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fc4a27]">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AI Resume Assistant</h3>
                  <p className="text-[10px] text-emerald-400">Powered by Groq Llama-3.3-70B</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAIAssistant}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#fc4a27] text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSendingChat && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-500 shadow-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#fc4a27]" />
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="border-t border-gray-200 bg-white p-3 flex gap-2">
              <input
                type="text"
                placeholder="Ask AI anything about your resume..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fc4a27] text-white hover:bg-[#e0401f] transition disabled:opacity-40 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </AIAssistantContext.Provider>
  );
}
