// Using global fetch (available in Node 18+)

const BASE_URL = 'http://localhost:5000';
let sessionCookie = '';

async function runTests() {
    console.log('--- Starting Enterprise Security Tests ---');

    try {
        // 0. Register a test user to get a session
        console.log('\n[0] Registering test user...');
        const username = `testuser_${Math.floor(Math.random() * 10000)}`;
        const regRes = await fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password: 'password123'
            })
        });

        if (regRes.ok) {
            console.log('Registration: PASS');
            sessionCookie = regRes.headers.get('set-cookie') || '';
        } else {
            const regData = await regRes.json();
            console.log(`Registration: FAIL (${regData.message})`);
            // Try fallback login if user exists
            console.log('Attempting login instead...');
            const loginRes = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: 'password123' })
            });
            sessionCookie = loginRes.headers.get('set-cookie') || '';
        }

        // 1. Check Security Headers
        console.log('\n[1] Testing Security Headers...');
        const headRes = await fetch(`${BASE_URL}/api/security/compliance-status`, {
            headers: { 'Cookie': sessionCookie }
        });
        console.log('CSP:', headRes.headers.get('content-security-policy') ? 'PASS' : 'FAIL');
        console.log('X-Frame-Options:', headRes.headers.get('x-frame-options') === 'DENY' ? 'PASS' : 'FAIL');
        console.log('X-Content-Type-Options:', headRes.headers.get('x-content-type-options') === 'nosniff' ? 'PASS' : 'FAIL');

        // 2. Testing Compliance Status
        console.log('\n[2] Testing Compliance Status...');
        const compRes = await fetch(`${BASE_URL}/api/security/compliance-status`, {
            headers: { 'Cookie': sessionCookie }
        });
        const compData = await compRes.json();
        console.log('Readiness Score:', compData.readinessScore);
        console.log('Status:', compData.status);
        console.log('Checks count:', compData.checks?.length || 0);

        // 3. Testing MFA Setup
        console.log('\n[3] Testing MFA Setup...');
        const mfaSetupRes = await fetch(`${BASE_URL}/api/mfa/setup`, {
            method: 'POST',
            headers: { 'Cookie': sessionCookie }
        });
        const mfaData = await mfaSetupRes.json();
        console.log('MFA Secret Generated:', mfaData.secret ? 'PASS' : 'FAIL');

        // 4. Testing MFA Verification (Demo Code)
        console.log('\n[4] Testing MFA Verification...');
        const mfaVerifyRes = await fetch(`${BASE_URL}/api/mfa/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
            body: JSON.stringify({ code: '123456' })
        });
        const mfaVerifyData = await mfaVerifyRes.json();
        console.log('MFA Verification:', mfaVerifyData.success ? 'PASS' : 'FAIL');

        // 5. Testing Tokenization
        console.log('\n[5] Testing Tokenization...');
        const tokRes = await fetch(`${BASE_URL}/api/security/tokenize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
            body: JSON.stringify({ data: 'SENSITIVE_PII_12345' })
        });
        const tokData = await tokRes.json();
        console.log('Token Created:', tokData.token ? 'PASS' : 'FAIL');

        // 6. Testing Detokenization (Need to be admin for detok)
        // Since testuser is 'client', this might fail, which is GOOD (testing RBAC)
        console.log('\n[6] Testing Detokenization (RBAC Check)...');
        const detokRes = await fetch(`${BASE_URL}/api/security/detokenize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': sessionCookie },
            body: JSON.stringify({ token: tokData.token })
        });
        console.log('Detokenization Status:', detokRes.status === 403 ? 'PASS (Forbidden for non-admin)' : `FAIL (Status: ${detokRes.status})`);

        console.log('\n--- All Tests Completed ---');

    } catch (err) {
        console.error('Test Suite Failed:', err.message);
    }
}

runTests();
