import React, { useState, useRef, useEffect } from 'react';
import useChat from '../hooks/useChat';
import { jsPDF } from "jspdf";
import '../styles/ChatInterface.css';

function ChatInterface() {
    const [input, setInput] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const { messages, chatHistory, currentStep, isLoading, error, sendMessage, clearChat } = useChat();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleOptionClick = async (option) => {
        setInput(option);
        await sendMessage(option, currentStep);
        setInput('');
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        await sendMessage(input, currentStep);
        setInput('');
    };

    const handleDownload = (downloadLink) => {
        if (downloadLink) {
            const link = document.createElement('a');
            link.href = downloadLink;
            link.download = downloadLink.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderOptions = (message) => {
        if (!message.options) return null;

        return (
            <div className="chat-options">
                {message.downloadLink && (
                    <button
                        onClick={() => handleDownload(message.downloadLink)}
                        className="download-form-button"
                    >
                        Download Form
                    </button>
                )}
                {message.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="option-button"
                    >
                        {option}
                    </button>
                ))}
            </div>
        );
    };

    const downloadChatHistory = () => {
        const pdf = new jsPDF();
        let yOffset = 20;
        const pageHeight = pdf.internal.pageSize.height;
        const lineHeight = 7;
        const margin = 20;
        const maxLineWidth = 170;

        // Add title
        pdf.setFontSize(16);
        pdf.text('ITR Guide Bot - Chat History', margin, yOffset);
        yOffset += lineHeight * 2;

        // Set normal font size for content
        pdf.setFontSize(10);

        chatHistory.forEach((conversation, index) => {
            // Add timestamp
            const timestamp = new Date(conversation.timestamp).toLocaleString();
            pdf.setFont(undefined, 'bold');
            pdf.text(`Conversation ${index + 1} - ${timestamp}`, margin, yOffset);
            yOffset += lineHeight;
            pdf.setFont(undefined, 'normal');

            // Add messages
            conversation.messages.forEach(msg => {
                // Check if we need a new page
                if (yOffset >= pageHeight - margin) {
                    pdf.addPage();
                    yOffset = margin;
                }

                // Add sender label
                pdf.setFont(undefined, 'bold');
                pdf.text(`${msg.type === 'user' ? 'You' : 'Bot'}:`, margin, yOffset);
                pdf.setFont(undefined, 'normal');

                // Handle long messages with text wrapping
                const splitText = pdf.splitTextToSize(msg.content, maxLineWidth);
                splitText.forEach(line => {
                    if (yOffset >= pageHeight - margin) {
                        pdf.addPage();
                        yOffset = margin;
                    }
                    pdf.text(line, margin + 15, yOffset);
                    yOffset += lineHeight;
                });

                yOffset += lineHeight / 2;
            });

            // Add separator between conversations
            if (index < chatHistory.length - 1) {
                if (yOffset >= pageHeight - margin) {
                    pdf.addPage();
                    yOffset = margin;
                }
                pdf.setDrawColor(200);
                pdf.line(margin, yOffset, pdf.internal.pageSize.width - margin, yOffset);
                yOffset += lineHeight * 1.5;
            }
        });

        // Save the PDF
        pdf.save('itr-guide-chat-history.pdf');
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h2>ITR Guide Bot 🤖</h2>
                <div className="chat-controls">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className="history-button"
                    >
                        {showHistory ? 'Hide History' : 'Show History'}
                    </button>
                    {chatHistory.length > 0 && (
                        <button 
                            onClick={downloadChatHistory}
                            className="download-button"
                        >
                            Download History
                        </button>
                    )}
                    <button onClick={clearChat} className="clear-button">
                        Clear Chat
                    </button>
                </div>
            </div>

            {showHistory && chatHistory.length > 0 && (
                <div className="chat-history">
                    <h3>Chat History</h3>
                    {chatHistory.map((conversation) => (
                        <div key={conversation.id} className="history-item">
                            <div className="history-timestamp">
                                {new Date(conversation.timestamp).toLocaleString()}
                            </div>
                            <div className="history-messages">
                                {conversation.messages.map((msg, idx) => (
                                    <div key={idx} className={`message ${msg.type}`}>
                                        <div className="message-content">
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <div className="message-content">
                            {message.content}
                            {message.type === 'bot' && renderOptions(message)}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message bot">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your message or select an option above..."
                    rows="1"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatInterface; 