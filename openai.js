const axios = require('axios');

// Set your OpenAI API key
const apiKey = 's';

// Set up Axios instance with your API key
const instance = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
});

// Example function to interact with the OpenAI API
async function generateText(prompt) {
    try {
        const response = await instance.post('/engines/gpt-3.5-turbo-instruct/completions', {
            prompt: prompt,
            max_tokens: 50
        });
        console.log(response.data.choices[0].text.trim());
    } catch (error) {
        console.error('Error:', error.response.data);
    }
}

// Call the function with a prompt
generateText("Once upon a time");
