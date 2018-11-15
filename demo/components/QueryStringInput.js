const { Component, createElement: h } = window.React;

const buildSearchParams = (queries) => {
  return new URLSearchParams(
    queries
      .filter(query => query.name && query.value)
      .map(query => [query.name, query.value])
  );
};

const updateQuery = (queries, queryIndex, updater) => ([
  ...queries.slice(0, queryIndex),
  updater(queries[queryIndex]),
  ...queries.slice(queryIndex + 1),
]);

const DEFAULT_STATE = {
  queries: [
    { name: '', value: '' },
  ],
};

export class QueryStringInput extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }
  
  onChange(changedQueries) {
    this.props.onChange(buildSearchParams(changedQueries));
  }

  updateQueryName(queryIndex, newQueryName) {
    const newQueries = updateQuery(
      this.state.queries,
      queryIndex,
      query => ({ ...query, name: newQueryName }),
    );
    this.setState({ queries: newQueries });
    this.onChange(newQueries);
  }

  updateQueryValue(queryIndex, newQueryValue) {
    const newQueries = updateQuery(
      this.state.queries,
      queryIndex,
      query => ({ ...query, value: newQueryValue }),
    );
    this.setState({ queries: newQueries });
    this.onChange(newQueries);
  }

  addQuery() {
    const newQueries = [
      ...this.state.queries,
      { name: '', value: '' },
    ];
    this.setState({ queries: newQueries });
    this.onChange(newQueries);
  }

  deleteQuery(queryIndex) {
    const newQueries = [
      ...this.state.queries.slice(0, queryIndex),
      ...this.state.queries.slice(queryIndex + 1),
    ];
    this.setState({ queries: newQueries });
    this.onChange(newQueries);
  }

  render() {
    const { queries } = this.state;

    return (
      h('fieldset', null, [
        ...queries.map((query, index) => h('section', null, [
          h('input', { value: query.name, className: 'queryNameInput', onChange: (event) => this.updateQueryName(index, event.target.value) }),
          h('input', { value: query.value, className: 'queryValueInput', onChange: (event) => this.updateQueryValue(index, event.target.value) }),
          h('button', { type: 'button', onClick: () => this.deleteQuery(index) }, 'Remove'),
        ])),
        h('button', { type: 'button', onClick: () => this.addQuery() }, 'Add Query'),
      ])
    );
  }
};
