const { GoogleGenerativeAI } = require("@google-ai/generativai");

exports.handler = async (event, context) => {
  // These headers allow your Durable site to talk to Netlify
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const data = JSON.parse(event.body);
    const userMessage = data.message;

    // The AI's instructions
    const prompt = `You are a professional fashion expert for Sai Enterprises. 
    The user wants to know about: "${userMessage}". 
    Give a 2-sentence style tip and then say: "Check out my curated selection on Amazon below!"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Connection failed. Check Netlify Environment Variables." }),
    };
  }
};
