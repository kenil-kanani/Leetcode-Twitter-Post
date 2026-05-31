const USAGE_TEXT = `
Usage:
  npm start -- <leetcode-username>

Example:
  npm start -- kenilkanani
`.trim();

export function getUsageText() {
  return USAGE_TEXT;
}

export function parseCliArguments(argv) {
  const args = [...argv];
  const options = {
    showHelp: false,
    username: '',
  };

  while (args.length > 0) {
    const current = args.shift();

    if (current === '--help' || current === '-h') {
      options.showHelp = true;
      return options;
    }

    if (current.startsWith('-')) {
      throw new Error(`Unknown option: ${current}`);
    }

    if (options.username) {
      throw new Error('Only one LeetCode username can be provided.');
    }

    options.username = current;
  }

  if (!options.username) {
    throw new Error('A LeetCode username is required.');
  }

  return options;
}
