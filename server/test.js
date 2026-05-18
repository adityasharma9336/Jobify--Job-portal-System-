const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
require('dotenv').config();

(async () => {
    try {
        const token = jwt.sign({ id: '65f0b5d9b23b1a2c3d4e5f6g' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const resJob = await fetch('http://localhost:8000/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Test', company: 'Test', location: 'Test', type: 'Full-time', salary: 'Test', description: 'Test', category: 'Engineering', icon: 'work', logoBg: 'bg-primary', logoColor: 'text-white'
            })
        });

        const jobData = await resJob.json();
        console.log('Job response code:', resJob.status);
        console.log('Job response body:', jobData);
    } catch (e) {
        console.error(e);
    }
})();
