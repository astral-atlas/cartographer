import { QueryStringInput } from './components/QueryStringInput.js';

const { React, ReactDOM } = window;
const { Component, createElement: h } = React;

const DEFAULT_STATE = {
  serviceDomain: 'http://localhost:8888',
  routeIndex: 0,
  response: null,
  responseError: null,
  dirty: true,
  body: '',
  searchParams: new URLSearchParams(),
};

const tryPrettyStringify = (valueToStringify) => {
  try {
    return JSON.stringify(JSON.parse(valueToStringify), null, 3);
  } catch (err) {
    return 'Invalid JSON';
  }
}

const shouldSendBody = (method) => {
  switch (method) {
    case 'POST':
    case 'PUT':
    case 'PATCH':
      return true;
    case 'GET':
    case 'OPTIONS':
    case 'HEAD':
    default:
      return false;
  }
};

const getFetchOptions = (method, body) => {
  if (shouldSendBody(method)) {
    return { method, body };
  } else {
    return { method };
  }
};

const routes = [
  { endpointPath: '/chapters', method: 'GET' },
  { endpointPath: '/chapters', method: 'POST' },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  updateServiceDomain(newServiceDomain) {
    this.setState({ serviceDomain: newServiceDomain, dirty: true });
  }

  makeRequest(event) {
    const { serviceDomain, routeIndex, body, searchParams } = this.state;
    const { method, endpointPath } = routes[routeIndex];

    const url = new URL(endpointPath, serviceDomain);
    url.search = searchParams.toString();
    
    fetch(url, getFetchOptions(method, body, searchParams))
      .then(response => response.text())
      .then(textResponse => {
        try { return JSON.stringify(JSON.parse(textResponse), null, 3) }
        catch (err) { return textResponse }
      })
      .then(parsedResponse => this.setState({ response: parsedResponse, responseError: null, dirty: false }))
      .catch(error => this.setState({ responseError: error, dirty: false }));
  }

  updateRouteIndex(newRouteIndex) {
    this.setState({ routeIndex: newRouteIndex, dirty: true });
  }

  updateBody(newBody) {
    this.setState({ body: newBody, dirty: true });
  }

  onQueryChange(searchParams) {
    this.setState({ searchParams: searchParams });
  }

  render() {
    const { serviceDomain, routeIndex, response, body, responseError, dirty, searchParams } = this.state;
    const { method, endpointPath } = routes[routeIndex];

    const url = new URL(endpointPath, serviceDomain);
    url.search = searchParams.toString();

    return (
      h('form', null, [
        h('section', { className: 'serviceSection' }, [
          h('input', { onChange: event => this.updateServiceDomain(event.target.value), value: serviceDomain }),
        ]),
        h('section', { className: 'endpointSection' }, [
          h('select', { onChange: event => this.updateRouteIndex(event.target.value), value: routeIndex }, [
            h('option', { value: 0 }, 'Get Chapter'),
            h('option', { value: 1 }, 'Add New Empty Chapter'),
          ]),
          h('pre', { className: 'urlPreview' }, `${method} => ${url.toString()}`),
        ]),
        h('section', { className: 'requestSection' }, [
          h('section', null, h(QueryStringInput, { onChange: (query) => this.onQueryChange(query) })),
          (method === 'POST' || method === 'PUT' || method === 'PATCH') &&
            h('section', { className: 'bodySection' }, [
              h('textarea', { onChange: event => this.updateBody(event.target.value), className: 'bodyInput' }),
              h('pre', { className: 'bodyPreview' }, tryPrettyStringify(body)),
            ]),
          h('button', { type: 'button', onClick: () => this.makeRequest() }, 'Request'),
        ]),
        h('section', { className: `responseSection ${dirty ? 'dirty' : ''}` }, [
          response !== null && responseError === null && h('pre', null, response),
          responseError !== null && h('pre', null, responseError.message),
        ]),
      ])
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    h(App),
    document.body.appendChild(document.createElement('div'))
  )
});

// 2 3 (1) 1 2 3 (4) = 16
