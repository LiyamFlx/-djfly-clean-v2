import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body || '{}');

  if (!prompt) {
    return { statusCode: 400, body: 'Prompt is required' };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a world-class DJ creating a playlist. Your goal is to generate a list of 10-15 tracks based on the user's prompt. Return the list as a JSON object with a "tracks" key, which is an array of objects, each with a "title" and "artist" property. Do not include any other text in your response.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response || '{}');

    return {
      statusCode: 200,
      body: JSON.stringify(parsedResponse),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate set' }),
    };
  }
};

export { handler };
