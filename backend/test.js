const axios = require('axios');

async function testChat() {
    try {
        const response = await axios.post('http://localhost:5000/api/chat', {
            message: 'hi'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testChat(); 