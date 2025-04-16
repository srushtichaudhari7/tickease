import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChatBot({ taskId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/tasks/${taskId}/chat`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    
    if(taskId) fetchChatHistory();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const userMessage = { content: input, sender: 'user', timestamp: new Date() };
      
      const response = await axios.post(`/api/tasks/${taskId}/chat`, {
        message: input
      });

      setMessages([...messages, userMessage, {
        content: response.data.reply,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' 
              ? 'bg-blue-100 ml-auto' 
              : 'bg-gray-100 mr-auto'}`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg p-2 text-sm"
          placeholder="Type your question..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}