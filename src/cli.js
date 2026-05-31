const USAGE_TEXT = `
Usage:
  npm start -- <leetcode-username> [options]

Options:
  --browser <name>     Choose a browser app like chrome, firefox, edge, or default.
  --no-open            Skip opening the share URL after the image is generated.
  --output-dir <path>  Save the generated image in a custom directory.
  --help, -h           Show usage information.

Example:
  npm start -- kenilkanani --browser chrome --output-dir ./assets/generated
`.trim();

export function getUsageText() {
  return USAGE_TEXT;
}

export function parseCliArguments(argv) {
  const args = [...argv];
  const options = {
    browser: '',
    openBrowser: true,
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

    if (current === '--browser') {
      const browser = args.shift();

      if (!browser) {
        throw new Error('Missing value for --browser.');
      }

      options.browser = browser;
      continue;
    }

    if (current === '--no-open') {
      options.openBrowser = false;
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
