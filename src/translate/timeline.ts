import { fetchAction } from './action';
import { fetchItem } from './item';
import { fetchSearch } from './search';
import { fetchStatus } from './status';

export const timelineCache = new Map<string, string>([
  // originally translated
  ['资源', '资源'],
  ['职业量谱', '职业量谱'],
  ['触发', '触发'],
  // terms
  ['Raid Buffs', '团辅'],
  ['Arcanum', '奥秘卡'],
  ['GCD', 'GCD'],
]);

export const fetchTimeline = async (text: string): Promise<string> => {
  if (timelineCache.has(text)) {
    return timelineCache.get(text) as string;
  }

  let items = await fetchSearch(text);
  items = items.filter((item) => {
    // exact match
    if (item.obj.n !== text) {
      return false;
    }
    // only action, status, item
    if (item.type !== 'action' && item.type !== 'status' && item.type !== 'item') {
      return false;
    }
    return true;
  });

  const translations = new Map<string, number>();

  // count translations
  for (const item of items) {
    try {
      let translatedText;
      if (item.type === 'action') {
        // action
        const result = await fetchAction(item.id);
        translatedText = result.name;
      } else if (item.type === 'status') {
        // status
        const result = await fetchStatus(item.id);
        translatedText = result.name;
      } else {
        // item
        const result = await fetchItem(item.id);
        translatedText = result.name;
      }
      const count = translations.get(translatedText) || 0;
      translations.set(translatedText, count + 1);
    } catch (e) {
      console.error(e);
    }
  }

  // get most common translation
  let maxCount = 0;
  let translation = text;
  for (const [key, value] of translations.entries()) {
    if (value > maxCount) {
      maxCount = value;
      translation = key;
    }
  }

  return translation;
};

export const translateTimeline = async (text: string): Promise<string> => {
  return fetchTimeline(text);
};

export const injectTimeline = () => {
  const className = 'Timeline-module_content';
  const selector = `[class^="${className}"], [class*=" ${className}"]`;
  const observer = new MutationObserver((mutations) => {
    const found = [];
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(selector)) {
              found.push(node);
            } else {
              const children = node.querySelectorAll(selector);
              for (const child of children) {
                found.push(child);
              }
            }
          }
        }
      }
    }
    for (const node of found) {
      const text = node.textContent;
      if (text) {
        fetchTimeline(text).then((translation) => {
          node.textContent = translation;
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
