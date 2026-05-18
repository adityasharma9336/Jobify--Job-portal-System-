const { GoogleGenAI } = require('@google/genai');

// @desc    Handle chat message
// @route   POST /api/support/chat
// @access  Public
const handleChatMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            // Use Google Gemini API
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            // Note: We use system instructions to give it the Jobify persona.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: message,
                config: {
                    systemInstruction: "You are the helpful AI support assistant for Jobify, a premium job portal. You help candidates build resumes, find jobs, and provide career tips. You also help employers post jobs and manage applications. Keep your answers concise, professional, and friendly.",
                }
            });

            return res.json({ reply: response.text });
        } else {
            // Mock Response Fallback if no API key is provided
            console.log("No GEMINI_API_KEY provided. Using mock response for message:", message);
            setTimeout(() => {
                res.json({
                    reply: `(Mock Mode) Hello! You said: "${message}". To get real AI responses, please ask the admin to configure the GEMINI_API_KEY in the server environment.`
                });
            }, 1000);
        }

    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ message: 'Error processing your request. Please try again later.' });
    }
};

module.exports = {
    handleChatMessage
};
