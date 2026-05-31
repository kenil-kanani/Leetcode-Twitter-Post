import open, { apps } from 'open';

const BROWSER_ALIASES = {
  chrome: apps.chrome,
  default: apps.browser,
  edge: apps.edge,
  firefox: apps.firefox,
  private: apps.browserPrivate,
};

function resolveBrowserName(browserName) {
  if (!browserName) {
    return '';
  }

  return BROWSER_ALIASES[browserName.toLowerCase()] ?? browserName;
}

export async function openShareUrl(url, options = {}) {
  if (options.openBrowser === false) {
    return false;
  }

  const browserName = resolveBrowserName(options.browser);

  if (!browserName) {
    await open(url);
    return true;
  }

  await open(url, {
    app: {
      name: browserName,
    },
  });

  return true;
}
