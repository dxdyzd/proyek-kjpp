const base = 'http://localhost:5173/api/login';

const tests = [
  {
    name: 'valid-credentials',
    body: { username: 'adminoffice', password: 'office123', role: 'admin-office' },
    expectOk: true,
  },
  {
    name: 'invalid-password',
    body: { username: 'adminoffice', password: 'wrong', role: 'admin-office' },
    expectOk: false,
  },
  {
    name: 'missing-fields',
    body: { username: 'x' },
    expectOk: false,
  },
];

async function run() {
  console.log('Running login tests against', base);
  let allPassed = true;

  for (const t of tests) {
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t.body),
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        data = text;
      }

      const ok = res.ok;
      const passed = ok === t.expectOk;
      allPassed = allPassed && passed;

      console.log(`\nTest: ${t.name}`);
      console.log('Status:', res.status);
      console.log('Expected ok:', t.expectOk, 'Actual ok:', ok);
      console.log('Body:', typeof data === 'string' ? data : JSON.stringify(data));
    } catch (err) {
      allPassed = false;
      console.log(`\nTest: ${t.name}`);
      console.log('Error:', err.message || err);
    }
  }

  if (allPassed) {
    console.log('\nAll tests passed.');
    process.exit(0);
  } else {
    console.log('\nSome tests failed.');
    process.exit(2);
  }
}

run();
