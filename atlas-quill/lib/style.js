export const parseRules = (styleElement) => [
  ...styleElement.sheet.cssRules
].map(rule => rule
  .selectorText
  .replace('.', '')
);

export const css = (styles) => {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles.join('');
  document.head.appendChild(styleElement);
  return styleElement;
};

export const styleLink = (href) => {
  const styleElement = document.createElement('link');
  styleElement.setAttribute('rel', 'stylesheet');
  styleElement.setAttribute('type', 'test/css');
  styleElement.setAttribute('href', href);
  document.head.appendChild(styleElement);
  return styleElement;
}
