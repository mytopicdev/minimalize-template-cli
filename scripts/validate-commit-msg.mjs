import fs from 'node:fs'

const TYPES = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  refactor: '♻️',
  test: '✅',
  chore: '🔧',
}

const RELEASE_RE = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/
const COMMIT_RE = /^(\S+)\s+(feat|fix|docs|refactor|test|chore)(?:\(([a-z0-9][a-z0-9-_/]*)\))?:\s(.+)$/

function isBypassCommit(message) {
  return message.startsWith('Merge ') || message.startsWith('Revert ') || RELEASE_RE.test(message)
}

function validateSubject(subject) {
  if (subject.length === 0) {
    return 'Subject is required.'
  }

  if (subject.length > 72) {
    return 'Subject must be 72 characters or fewer.'
  }

  if (subject.endsWith('.')) {
    return 'Subject must not end with a period.'
  }

  return null
}

function validateCommitMessage(message) {
  if (isBypassCommit(message)) {
    return null
  }

  const match = message.match(COMMIT_RE)
  if (!match) {
    return 'Invalid format.'
  }

  const [, emoji, type, , subject] = match
  const expectedEmoji = TYPES[type]

  if (emoji !== expectedEmoji) {
    return `Emoji mismatch for type "${type}". Expected "${expectedEmoji}".`
  }

  return validateSubject(subject)
}

function usage() {
  console.error('Usage: node scripts/validate-commit-msg.mjs <commit-msg-file>')
}

function printHelp(errorMessage) {
  if (errorMessage) {
    console.error(`❌ ${errorMessage}`)
  }

  console.error('')
  console.error('Expected format: <emoji> <type>(<scope>): <short subject>')
  console.error('Example: ✨ feat(cli): add project name validation')
  console.error('')
  console.error('Allowed type -> emoji:')
  for (const [type, emoji] of Object.entries(TYPES)) {
    console.error(`- ${type}: ${emoji}`)
  }
  console.error('')
  console.error('Bypass messages allowed: Merge, Revert, vX.Y.Z')
}

const filePath = process.argv[2]

if (!filePath) {
  usage()
  process.exit(1)
}

let raw
try {
  raw = fs.readFileSync(filePath, 'utf8')
} catch {
  console.error(`Could not read commit message file: ${filePath}`)
  process.exit(1)
}

const firstLine = raw.split(/\r?\n/)[0].trim()
const validationError = validateCommitMessage(firstLine)

if (validationError) {
  printHelp(validationError)
  process.exit(1)
}

process.exit(0)
