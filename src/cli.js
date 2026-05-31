const USAGE_TEXT = `
Usage:
  npm start -- <leetcode-username> [options]

Options:
  --output-dir <path>  Save the generated image in a custom directory.
  --help, -h           Show usage information.

Example:
  npm start -- kenilkanani --output-dir ./assets/generated
`.trim();

export function getUsageText() {
  return USAGE_TEXT;
}

export function parseCliArguments(argv) {
  const args = [...argv];
  const options = {
    outputDir: '',
    showHelp: false,
    username: '',
  };

  while (args.length > 0) {
    const current = args.shift();

    if (current === '--help' || current === '-h') {
      options.showHelp = true;
      return options;
    }

    if (current === '--output-dir') {
      const outputDir = args.shift();

      if (!outputDir) {
        throw new Error('Missing value for --output-dir.');
      }

      options.outputDir = outputDir;
      continue;
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
