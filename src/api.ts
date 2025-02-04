import { config } from './config';
import { ChatResponse } from './types';

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [{ role: "user", content: message }] })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from Azure Function');
    }

    return { 
      message: data.choices[0].message.content,
      error: undefined
    };
  } catch (error) {
    console.error('Error calling Azure Function:', error);
    throw error; // Let the component handle the error
  }
}