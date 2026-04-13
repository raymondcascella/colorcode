export function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

export function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`FAIL: ${message}\n  actual:   ${a}\n  expected: ${e}`);
}

export function runSuite(suiteName, tests) {
  const results = [];
  for (const [name, fn] of Object.entries(tests)) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (e) {
      results.push({ name, pass: false, error: e.message });
    }
  }
  return { suiteName, results };
}
