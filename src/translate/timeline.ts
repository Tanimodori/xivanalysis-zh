import { actionCache } from './action';
import { itemCache } from './item';
import { statusCache } from './status';

export const timelineCache = new Map<string, HTMLElement>();

export const translateTimeline = async (text: string): Promise<string> => {
  for (const v of actionCache.values()) {
    if (v.en.name === text) {
      return v.name;
    }
  }
  for (const v of statusCache.values()) {
    if (v.en.name === text) {
      return v.name;
    }
  }
  for (const v of itemCache.values()) {
    if (v.en.name === text) {
      return v.name;
    }
  }
  return text;
};

export const translateTimelineNodes = async () => {
  for (const [text, node] of timelineCache.entries()) {
    const translated = await translateTimeline(text);
    node.textContent = translated;
  }
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
        timelineCache.set(text, node as HTMLElement);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
