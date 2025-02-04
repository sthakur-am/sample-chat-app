import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Message, ChatState } from './types';
import { sendMessage } from './api';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));
    setInput('');

    try {
      const response = await sendMessage(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        sender: 'assistant',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[80vh]">
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-semibold">Chat with AI</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {chatState.isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"></div>
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full delay-100"></div>
              <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full delay-200"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={chatState.isLoading}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;