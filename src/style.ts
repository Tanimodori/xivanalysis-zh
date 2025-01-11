import injectedStyle from './styles/index.css?inline';

const injectWindowElement = (node: HTMLElement) => {
  const observer = new MutationObserver((_mutations) => {
    const altContainer = node.querySelector('div span.alternative-container');
    if (altContainer) {
      const alts = altContainer.querySelectorAll('span.alternative');
      const alt0 = alts[0] as HTMLElement;
      const alt1 = alts[1] as HTMLElement;
      alt1.style.display = alt0.style.display === 'none' ? 'inline' : 'none';
    }
  });
  observer.observe(node, { attributes: true, childList: true, subtree: true });

  // click
  node.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      if (target.tagName.toLowerCase() === 'span' && target.classList.contains('alternative')) {
        const container = target.parentElement as HTMLElement;
        const alts = container.querySelectorAll('span.alternative');
        for (const alt of alts) {
          if (alt instanceof HTMLElement) {
            alt.style.display = alt.style.display === 'none' ? 'inline' : 'none';
          }
        }
      }
    }
  });
};

const injectWindow = () => {
  window.addEventListener('load', () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length === 0) {
          return;
        }
        const node = mutation.addedNodes[0] as HTMLElement;
        if (
          node.tagName.toLowerCase() === 'div' &&
          node.id.toLowerCase() !== 'root' &&
          node.style.position.toLowerCase() === 'absolute' &&
          node.style.top.toLowerCase() === '0px' &&
          node.style.left.toLowerCase() === '0px'
        ) {
          injectWindowElement(node);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: false });
  });
};

const injectCss = () => {
  const styleSheet = document.createElement('style');
  styleSheet.setAttribute('type', 'text/css');
  styleSheet.innerHTML = injectedStyle;
  document.head.appendChild(styleSheet);
};

export const injectStyle = () => {
  injectCss();
  injectWindow();
};
