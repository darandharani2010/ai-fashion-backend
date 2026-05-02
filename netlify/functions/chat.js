const { GoogleGenerativeAI } = require("@google-ai/generativai");

exports.handler = async (event, context) => {
  // CORS Headers to fix the "Backend is live" error
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

    // AI Stylist Instructions
    const prompt = `You are a professional Indian fashion stylist. 
    The user is looking for: "${userMessage}". 
    Provide a professional style tip (2-3 sentences) on how to wear this.
    End with: "You can find my top recommended picks on my Amazon shop below!"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Check GEMINI_KEY in Netlify settings" }),
    };
  }
};
