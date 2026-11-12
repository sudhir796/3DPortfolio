import { profile, quests, abilities, journey, contact, isTODO } from '../src/data/content.js';

async function testUrl(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, error: 'Invalid protocol (must be http/https)' };
    }
  } catch (err) {
    return { ok: false, error: `Malformed URL: ${err.message}` };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    // Try HEAD first, fall back to GET if 405/403
    let res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'AdventurersGuildBot/1.0' },
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timer);

    if (!res || !res.ok) {
      const getTimer = setTimeout(() => controller.abort(), 6000);
      res = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'AdventurersGuildBot/1.0' },
        signal: controller.signal,
      });
      clearTimeout(getTimer);
    }

    return { ok: res.ok, status: res.status };
  } catch (err) {
    // Some domains (like GitHub or bot-protected sites) return network or SSL quirks; warn instead of crashing
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('====================================================');
  console.log('⚔  ADVENTURERS\' GUILD: LINK & CONTENT AUDIT');
  console.log('====================================================\n');

  let malformedCount = 0;
  const todoList = [];
  const urlsToCheck = [];

  // 1. Audit Profile TODOs
  for (const [key, val] of Object.entries(profile)) {
    if (isTODO(val)) {
      todoList.push({ section: 'Profile', field: key, value: String(val) });
    }
  }

  // 2. Audit Contact URLs & TODOs
  for (const [key, val] of Object.entries(contact)) {
    if (isTODO(val)) {
      todoList.push({ section: 'Contact', field: key, value: String(val) });
    } else if (typeof val === 'string' && val.startsWith('http')) {
      urlsToCheck.push({ source: `Contact.${key}`, url: val });
    }
  }

  // 3. Audit Quests URLs & TODOs
  for (const q of quests) {
    if (isTODO(q.statusNote)) {
      // Empty status note is allowed, not a critical TODO
    }
    if (q.links) {
      if (isTODO(q.links.github)) {
        todoList.push({ section: `Quest [${q.title}]`, field: 'links.github', value: '(empty)' });
      } else {
        urlsToCheck.push({ source: `Quest [${q.title}] GitHub`, url: q.links.github });
      }

      if (isTODO(q.links.demo)) {
        todoList.push({ section: `Quest [${q.title}]`, field: 'links.demo', value: '(empty)' });
      } else {
        urlsToCheck.push({ source: `Quest [${q.title}] Demo`, url: q.links.demo });
      }
    }
  }

  // 4. Validate URLs
  console.log(`Checking ${urlsToCheck.length} configured URL(s)...`);
  for (const item of urlsToCheck) {
    // Quick syntax verification
    try {
      new URL(item.url);
      console.log(`  🔍 Testing [${item.source}]: ${item.url}`);
      const result = await testUrl(item.url);
      if (result.ok) {
        console.log(`     ✓ HTTP ${result.status} OK`);
      } else {
        console.warn(`     ⚠ HTTP Notice: ${result.error || `Status ${result.status}`}`);
      }
    } catch (err) {
      console.error(`     ✗ MALFORMED URL: "${item.url}" (${err.message})`);
      malformedCount++;
    }
  }

  // 5. Report TODOs Summary
  console.log('\n----------------------------------------------------');
  console.log(`📋 REMAINING CONTENT TODOs (${todoList.length} items to personalize):`);
  console.log('----------------------------------------------------');
  if (todoList.length === 0) {
    console.log('  None! All fields are populated.');
  } else {
    for (const item of todoList) {
      console.log(`  • [${item.section}] ${item.field} => ${item.value}`);
    }
  }

  console.log('\n====================================================');
  if (malformedCount > 0) {
    console.error(`❌ FAILED: ${malformedCount} malformed URL(s) detected.`);
    process.exit(1);
  } else {
    console.log('✅ PASSED: All configured URLs are syntactically valid.');
    console.log('Note: Empty TODO fields render gracefully without breaking the layout.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

