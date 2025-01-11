import injectedStyle from './styles/index.css?inline';

const incrementAltContainer = (container: HTMLElement, increment: number) => {
  const alts = container.querySelectorAll('span.alternative');
  const length = alts.length;
  let index = parseInt(container.style.getPropertyValue('--display-nth'));
  if (isNaN(index)) {
    index = increment;
  } else {
    index = (index + increment) % length;
  }
  container.style.setProperty('--display-nth', index.toString());

  // change the display
  for (let i = 0; i < length; i++) {
    const alt = alts[i];
    if (alt instanceof HTMLElement) {
      alt.style.display = i === index ? 'inline' : 'none';
    }
  }
};

const injectWindowElement = (node: HTMLElement) => {
  const applyToContainers = () => {
    const altContainers = node.querySelectorAll('div span.alternative-container');
    for (const altContainer of altContainers) {
      incrementAltContainer(altContainer as HTMLElement, 0);
    }
  };
  applyToContainers();
  const observer = new MutationObserver(applyToContainers);
  observer.observe(node, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });

  // click
  node.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      if (target.tagName.toLowerCase() === 'span' && target.classList.contains('alternative')) {
        const container = target.parentElement as HTMLElement;
        incrementAltContainer(container, 1);
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
    observer.observe(document.body, { attributes: true, childList: true, subtree: false });
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
