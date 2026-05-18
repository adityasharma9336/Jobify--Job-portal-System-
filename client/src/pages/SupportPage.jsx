import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SupportPage = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I am Jobify's AI Support Assistant. How can I help you today?", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/support/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await res.json();
            
            if (res.ok) {
                setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting right now. Please try again later.", isBot: true }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { text: "Sorry, a network error occurred.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-jobify text-white min-h-screen flex flex-col font-display relative">
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] orb-glow-1"></div>
                <div className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] orb-glow-2"></div>
            </div>
            
            <Header />

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-12 relative z-10 flex flex-col h-screen">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2">Jobify AI Support</h1>
                    <p className="text-gray-400">Ask any questions about career tips, resume building, or how to use our platform.</p>
                </div>

                <div className="flex-1 glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col mb-4 bg-white/5 relative shadow-[0_0_30px_rgba(140,43,238,0.1)]">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-4 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                {msg.isBot && (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg">
                                        <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                                    </div>
                                )}
                                
                                <div className={`max-w-[80%] rounded-2xl p-4 text-sm md:text-base leading-relaxed ${msg.isBot ? 'bg-white/10 text-white rounded-tl-none border border-white/5' : 'bg-primary text-white rounded-tr-none shadow-[0_0_15px_rgba(140,43,238,0.3)]'}`}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i !== msg.text.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {!msg.isBot && (
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-gray-300 text-lg">person</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <span className="material-symbols-outlined text-white text-lg animate-spin">sync</span>
                                </div>
                                <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 text-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message here..."
                                disabled={isLoading}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default SupportPage;
