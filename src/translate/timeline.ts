import { fetchAction } from './action';
import { fetchItem } from './item';
import { fetchSearch } from './search';
import { fetchStatus } from './status';
import { useCache } from './useCache';

export type ElementModifier = (el: HTMLElement) => void;
export type TimelineTranslation = string | ElementModifier;

const _fetchTimeline = async (text: string): Promise<TimelineTranslation> => {
  let items = await fetchSearch(text);
  items = items.filter((item) => {
    // exact match
    if (item.obj.n.toLowerCase() !== text.toLowerCase()) {
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

export const { fetch: fetchTimeline, cache: timelineCache } = useCache(_fetchTimeline);

const blmAFUI = (el: HTMLElement): void => {
  el.innerHTML = '';
  el.appendChild(document.createTextNode('星极火和'));
  el.appendChild(document.createElement('br'));
  el.appendChild(document.createTextNode('灵极冰'));
};

const timelineCacheInitials: Array<[string, TimelineTranslation]> = [
  // originally translated
  ['资源', '资源'],
  ['职业量谱', '职业量谱'],
  ['触发', '触发'],
  // terms
  ['Raid Buffs', '团辅'],
  ['GCD', 'GCD'],
  // == AST ==
  ['Arcanum', '奥秘卡'],
  // Neutral Sect/中间学派
  // https://garlandtools.cn/db/#status/1892
  ['Neutral Sect (Healing Potency)', '中间学派（治疗增益）'],
  // Neutral Sect/中间学派
  // https://garlandtools.cn/db/#status/1921
  ['Neutral Sect (Barrier)', '中间学派（血盾）'],
  // Wheel of Fortune/命运之轮
  // https://garlandtools.cn/db/#status/1206
  ['Wheel Of Fortune', '命运之轮（HoT）'],
  // Collective Unconscious (Mitigation)/命运之轮
  // https://garlandtools.cn/db/#status/849
  ['Collective Unconscious (Mitigation)', '命运之轮（减伤）'],
  // == WHM ==
  // Confession/告解
  // https://garlandtools.cn/db/#status/1219
  ['Confession', '告解'],
  // == SCH ==
  ['Autos', '自动技能'],
  ['Commands', '手动技能'],
  // Expedience/疾风之计
  // https://garlandtools.cn/db/#status/2712
  ['Expedience', '疾风之计'],
  // == DRK ==
  ['Esteem', '英雄的掠影'],
  // == DRG ==
  // Enhanced Piercing Talon/???(未实装)
  // https://www.garlandtools.cn/db/#status/1870
  // == SMN ==
  // "Energy Drain/Siphon"/"能量吸收/抽取"
  // https://garlandtools.cn/db/#action/16508
  // https://garlandtools.cn/db/#action/16510
  ['Energy Drain/Siphon', '能量吸收/抽取'],
  // Crimson Strike Ready/???(未实装)
  // https://www.garlandtools.org/db/#status/4400
  ['Pet', '召唤兽'],
  ['Demi', '亚灵神'],
  // == BRD ==
  ['Songs', '战歌'],
  // == BLM ==
  ['Ley Lines Buffs', '黑魔纹增益'],
  ['Astral Fire andUmbral Ice', blmAFUI],
  // == SAM ==
  // Tengentsu/天眼通 (misspelled)
  // https://www.garlandtools.cn/db/#status/3853
  ['Tengetsu', '天眼通'],
];
timelineCacheInitials.forEach(([text, translation]) => {
  timelineCache.set(text, Promise.resolve(translation));
});

export const translateTimeline = async (text: string): Promise<TimelineTranslation> => {
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
                if (child instanceof HTMLElement) {
                  found.push(child);
                }
              }
            }
          }
        }
      }
    }
    for (const node of found) {
      const gridColumnStart = node.parentElement?.style.gridColumnStart;
      if (gridColumnStart === '-3') {
        // skip 3rd column as it used to be username and enemy names
        continue;
      }
      const text = node.textContent;
      if (text) {
        fetchTimeline(text).then((translation) => {
          if (typeof translation === 'function') {
            translation(node);
          } else {
            node.textContent = translation;
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
