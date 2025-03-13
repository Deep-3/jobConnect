// controllers/chatcontroller.js
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
        content: `You are a job portal assistant.

        FOR JOB SEARCH QUERIES:
        1. Ask about preferred industry
        2. Ask about experience level
        3. Suggest relevant positions
        4. Provide salary ranges
        5. Mention location options

        FOR RESUME QUERIES:
        1. Guide on format
        2. Explain sections
        3. Give examples
        4. Highlight important points

        FOR INTERVIEW QUERIES:
        1. Common questions
        2. Preparation tips
        3. Dress code
        4. Body language advice

        ALWAYS:
        - Be professional
        - Give specific examples
        - End with a question
        - Keep responses concise
        - also consider previous resonse of user and not ask again same question`
    },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 150
        });
        console.log(completion.choices[0]);
        res.json({ 
            message: completion.choices[0].message.content 
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Failed to get response' 
        });
    }
};