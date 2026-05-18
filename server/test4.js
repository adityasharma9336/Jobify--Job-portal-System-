const fetch = require('node-fetch');

(async () => {
    try {
        const authRes = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'ajeet@test.com', password: 'password123' })
        });
        const auth = await authRes.json();
        const token = auth.token;
        if (!token) throw new Error("No token returned: " + JSON.stringify(auth));

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
        const text = await resJob.text();
        console.log('Status:', resJob.status);
        console.log('Body:', text);
        process.exit(0);
    } catch (e) {
        console.error("FATAL", e);
        process.exit(1);
    }
})();
