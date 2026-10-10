import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ignoredDirectories = new Set(['.git', '.superpowers', '.worktrees', 'node_modules']);
const prohibitedDirectories = new Set([
  'app',
  'bootstrap',
  'config',
  'database',
  'docker',
  'public',
  'resources',
  'routes',
  'storage',
  'vendor',
]);
const prohibitedExtensions = new Set(['.bak', '.dump', '.sql', '.sqlite', '.zip']);
const contentExtensions = new Set(['.md', '.svg', '.txt']);
const requiredDocuments = [
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'docs/portfolio-case-study.id.md',
  'docs/architecture.md',
  'docs/demo-publication-checklist.md',
  'assets/diagrams/sirap-conceptual-architecture.svg',
];

async function listFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const target = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(root, target));
      continue;
    }

    if (entry.isFile()) {
      files.push(path.relative(root, target));
    }
  }

  return files;
}

function isPortfolioContent(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');

  if (normalized.startsWith('docs/superpowers/')) {
    return false;
  }

  return (
    normalized === 'LICENSE'
    || normalized === 'README.md'
    || normalized === 'SECURITY.md'
    || contentExtensions.has(path.extname(normalized).toLowerCase())
  );
}

function forbiddenPathReason(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  const [firstSegment] = normalized.split('/');
  const basename = path.basename(normalized);
  const extension = path.extname(basename).toLowerCase();

  if (prohibitedDirectories.has(firstSegment)) {
    return 'contains an application-source directory';
  }

  if (basename === '.env' || basename.startsWith('.env.')) {
    return 'contains an environment file';
  }

  if (prohibitedExtensions.has(extension)) {
    return 'contains a prohibited archive or database export';
  }

  return null;
}

function contentFindings(relativePath, content) {
  const patterns = [
    [/\b(?:\d{1,3}\.){3}\d{1,3}\b/, 'contains an IPv4 address'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'contains a private-key marker'],
    [/\b[A-Z][A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD)\s*=\s*\S+/, 'contains an environment secret assignment'],
  ];

  return patterns
    .filter(([pattern]) => pattern.test(content))
    .map(([, reason]) => ({ path: relativePath, reason }));
}

/**
 * Scan repository paths and public-facing content without returning sensitive
 * values that may have triggered a finding.
 *
 * @param {string} root absolute or relative repository path
 * @returns {Promise<Array<{path: string, reason: string}>>}
 */
export async function scanRepository(root) {
  const findings = [];
  const files = await listFiles(root);

  for (const relativePath of files) {
    const pathReason = forbiddenPathReason(relativePath);
    if (pathReason) {
      findings.push({ path: relativePath, reason: pathReason });
      continue;
    }

    if (!isPortfolioContent(relativePath)) {
      continue;
    }

    const content = await readFile(path.join(root, relativePath), 'utf8');
    findings.push(...contentFindings(relativePath, content));
  }

  return findings;
}

/**
 * Validate that the public case-study contract is complete.
 *
 * @param {string} root absolute or relative repository path
 * @returns {Promise<Array<{path: string, reason: string}>>}
 */
export async function validatePortfolio(root) {
  const findings = [];

  for (const document of requiredDocuments) {
    try {
      const details = await stat(path.join(root, document));
      if (!details.isFile()) {
        findings.push({ path: document, reason: 'is not a file' });
      }
    } catch {
      findings.push({ path: document, reason: 'is required for public release' });
    }
  }

  return findings;
}
