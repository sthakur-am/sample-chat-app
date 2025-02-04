// Load environment variables
const azureFunctionUrl = import.meta.env.VITE_AZURE_FUNCTION_URL;

if (!azureFunctionUrl) {
  throw new Error('Azure Function URL is not configured. Please set VITE_AZURE_FUNCTION_URL in your .env file.');
}

export const config = {
  apiUrl: azureFunctionUrl
};
