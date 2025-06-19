


export async function fetchAdText(prompt, format = 'default') {
  const fullPrompt = `Erstelle einen ${format} Werbetext für folgende Beschreibung:\n${prompt}`;
  return await fetchGPTResponse(fullPrompt);
}

export async function fetchGPTResponse(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI API Fehler");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
