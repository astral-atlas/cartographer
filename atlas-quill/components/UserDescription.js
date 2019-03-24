import { jsx } from '../lib/react.js';
import { css } from '../lib/style.js';

css`
  .description-article {
    border: 1px solid black;
  }
  .description-heading {
    text-align: center;
    margin: 0.5em;
  }
  .description-text {
    text-align: center;
    margin: 0.5em;
  }
  .description-detail {
    list-style-type: none;
    padding: 0;
  }
  .description-list {
    margin: 0;
    padding: 0;
  }
`;

export const Description = ({ details }) => jsx`
  <article className="description-article">
    <ul className="description-list">
      ${details.map(([detailName, detailValue]) => jsx`
      <li className="description-detail" key=${detailName}>
        <h4 className="description-heading">${detailName}</h4>
        <p className="description-text">${detailValue}</p>
      </li>
      `)}
    </ul>
  </article>
`;
