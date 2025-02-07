import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  const storeInHistory = (conversation) => {
    const newHistory = [...chatHistory, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      messages: conversation
    }];
    setChatHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
  };

  const sendMessage = async (message, step) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${config.apiUrl}/chat`, {
        message,
        step: step || currentStep,
        userId: 'default'
      });

      const botResponse = response.data.response;
      setCurrentStep(botResponse.step);

      const updatedMessages = [
        ...messages,
        { type: 'user', content: message },
        { 
          type: 'bot', 
          content: botResponse.message,
          options: botResponse.options
        }
      ];

      setMessages(updatedMessages);

      // If this is a "Start Over" response, store current conversation in history
      if (botResponse.shouldStoreHistory) {
        storeInHistory(messages);
        setMessages([]); // Clear current conversation
      }

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to get response';
      setError(errorMessage);
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    storeInHistory(messages);
    setMessages([]);
    setError(null);
    setCurrentStep(null);
  };

  return {
    messages,
    chatHistory,
    currentStep,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};

export default useChat; 