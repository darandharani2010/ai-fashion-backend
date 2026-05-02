exports.handler = async (event) => {
  // Handles the "pre-flight" check browsers do for security
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    };
  }

  const { message } = JSON.parse(event.body);
  const API_KEY = process.env.GEMINI_KEY; // Hidden variable

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "You are a professional fashion stylist. " + message }] }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply: data.candidates[0].content.parts[0].text }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed" }) };
  }
};
