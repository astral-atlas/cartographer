import { jsx, Fragment } from '../lib/react.js';

export const withStyles = styles => component => {
  const ComponentEnhancedWithStyles = props => jsx`
    <${Fragment}>
      <style>${styles}</style>
      <${component} ...${props} />
    </${Fragment}>
  `;
  return ComponentEnhancedWithStyles;
}
