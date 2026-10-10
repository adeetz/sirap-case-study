import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  scanRepository,
  validatePortfolio,
} from '../scripts/check-public-safety.mjs';

const requiredDocuments = [
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'docs/portfolio-case-study.id.md',
  'docs/architecture.md',
  'docs/demo-publication-checklist.md',
  'assets/diagrams/sirap-conceptual-architecture.svg',
];

async function createFixture(files = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'sirap-public-safety-'));

  for (const document of requiredDocuments) {
    const target = path.join(root, document);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, '# Safe portfolio content\n');
  }

  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(root, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }

  return root;
}

async function withFixture(files, assertion) {
  const root = await createFixture(files);

  try {
    await assertion(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('accepts a clean portfolio fixture', async () => {
  await withFixture({}, async (root) => {
    assert.deepEqual(await scanRepository(root), []);
    assert.deepEqual(await validatePortfolio(root), []);
  });
});

test('flags prohibited files and application-source directories', async () => {
  await withFixture({
    '.env': 'APP_ENV=production\n',
    'backup.sql': '-- database export\n',
    'vendor/autoload.php': '<?php\n',
    'resources/app.tsx': 'export {}\n',
  }, async (root) => {
    const findings = await scanRepository(root);
    const paths = findings.map((finding) => finding.path);

    assert.deepEqual(paths.sort(), [
      '.env',
      'backup.sql',
      'resources/app.tsx',
      'vendor/autoload.php',
    ]);
  });
});

test('flags secret and infrastructure markers without echoing their values', async () => {
  await withFixture({
    'notes.md': [
      'Host 192.168.12.34 is private.',
      '-----BEGIN PRIVATE KEY-----',
      'APP_KEY=example-value',
    ].join('\n'),
  }, async (root) => {
    const findings = await scanRepository(root);
    const reasons = findings.map((finding) => finding.reason);

    assert.equal(reasons.length, 3);
    assert.deepEqual(reasons.sort(), [
      'contains an IPv4 address',
      'contains an environment secret assignment',
      'contains a private-key marker',
    ].sort());
    assert.equal(JSON.stringify(findings).includes('example-value'), false);
  });
});

test('reports every missing required public document', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'sirap-public-safety-'));

  try {
    const findings = await validatePortfolio(root);
    assert.deepEqual(
      findings.map((finding) => finding.path).sort(),
      requiredDocuments.slice().sort(),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('README contract keeps the demo private and provides a contact path', async () => {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const requiredHeadings = [
    '## Overview',
    '## Demo Access',
    '## Key Capabilities',
    '## Technology',
    '## Engineering Quality',
    '## Remote Collaboration',
    '## Case Study',
    '## Contact',
  ];

  for (const heading of requiredHeadings) {
    assert.equal(readme.includes(heading), true, `missing ${heading}`);
  }

  assert.equal(/https?:\/\//.test(readme), false);
  assert.equal(/@demo\.sirap\.local\b/.test(readme), false);
  assert.match(readme, /m\.noor\.aditya\.rahman@gmail\.com/);
});

test('case study and architecture contract describe the same safe boundaries', async () => {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const [caseStudy, architecture, diagram] = await Promise.all([
    readFile(path.join(root, 'docs/portfolio-case-study.id.md'), 'utf8'),
    readFile(path.join(root, 'docs/architecture.md'), 'utf8'),
    readFile(path.join(root, 'assets/diagrams/sirap-conceptual-architecture.svg'), 'utf8'),
  ]);

  for (const heading of ['## Masalah', '## Alur Kerja', '## Nilai Operasional', '## Ruang Lingkup Demo']) {
    assert.equal(caseStudy.includes(heading), true, `missing ${heading}`);
  }
  assert.equal(/https?:\/\//.test(caseStudy), false);

  for (const document of [architecture, diagram]) {
    for (const term of ['Browser', 'HTTPS', 'Laravel/Inertia', 'PostgreSQL', 'Private Evidence Storage']) {
      assert.equal(document.includes(term), true, `missing ${term}`);
    }
    assert.equal(/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(document), false);
    assert.equal(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(document), false);
  }
});

test('policy and demo checklist contract protects ownership and public access', async () => {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const [license, security, checklist] = await Promise.all([
    readFile(path.join(root, 'LICENSE'), 'utf8'),
    readFile(path.join(root, 'SECURITY.md'), 'utf8'),
    readFile(path.join(root, 'docs/demo-publication-checklist.md'), 'utf8'),
  ]);

  assert.equal(license.includes('All rights reserved'), true);
  assert.equal(security.includes('private'), true);
  for (const phrase of ['isolated database', 'isolated storage', 'Viewer', 'Staff', 'Verifier', 'reset process']) {
    assert.equal(checklist.includes(phrase), true, `missing ${phrase}`);
  }
  assert.match(checklist, /No production credentials/);
});
