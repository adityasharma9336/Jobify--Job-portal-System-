const axios = require('axios');

const test = async () => {
    try {
        const loginRes = await axios.post('http://localhost:8000/api/auth/login', {
            email: 'admin@jobify.com',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log('Login successful, token retrieved.');

        const appsRes = await axios.get('http://localhost:8000/api/admin/applications', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`Successfully fetched ${appsRes.data.length} applications as admin.`);
        if (appsRes.data.length > 0) {
            console.log('First App Job Title:', appsRes.data[0].job?.title);
            console.log('First App User Name:', appsRes.data[0].user?.name);
        }

    } catch (err) {
        console.error('Test failed:', err.response?.data || err.message);
    }
};

test();
