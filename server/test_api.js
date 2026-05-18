// const fetch = require('node-fetch'); // Native fetch in Node 18+

const API_URL = 'http://localhost:5001/api';
let token = '';

async function login() {
    const email = `test${Date.now()}@example.com`;
    try {
        console.log(`Registering user ${email}...`);
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password: 'password123', userType: 'job_seeker' })
        });
        const data = await res.json();
        if (res.ok) {
            token = data.token;
            console.log('Registration/Login successful, token obtained.');
        } else {
            console.log('Registration failed:', data);
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}

async function testEndpoint(endpoint) {
    try {
        console.log(`Testing GET ${endpoint}...`);
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 500) {
            console.error(`❌ 500 Error on ${endpoint}`);
            const text = await res.text();
            console.error('Response:', text);
        } else {
            console.log(`✅ ${endpoint} - Status: ${res.status}`);
        }
    } catch (error) {
        console.error(`Error testing ${endpoint}:`, error);
    }
}

async function run() {
    await login();
    await testEndpoint('/users/saved-jobs');
    await testEndpoint('/applications');
    await testEndpoint('/messages');

    // Test Filtering
    console.log('\n--- Testing Filters ---');
    await testEndpoint('/jobs?type=Full-time');
    await testEndpoint('/jobs?salary=$100k-$150k');
    await testEndpoint('/jobs?datePosted=All time');
}

run();
