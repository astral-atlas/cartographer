const { React, ReactDOM } = window;
const { Component, createElement } = React;

const DEFAULT_STATE = {
  serviceDomain: 'http://localhost:8888',
  endpointPath: '/chapter/getActiveIds',
  method: 'GET',
  response: null,
  responseError: null,
  dirty: true,
  body: '',
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  updateServiceDomain(newServiceDomain) {
    this.setState({ serviceDomain: newServiceDomain, dirty: true });
  }

  makeRequest(event) {
    event.preventDefault();
    const { serviceDomain, endpointPath, method, body } = this.state;
    
    fetch(`${serviceDomain}${endpointPath}`, getFetchOptions(method, body))
      .then(response => response.text())
      .then(textResponse => {
        try { return JSON.stringify(JSON.parse(textResponse), null, 3) }
        catch (err) { return textResponse }
      })
      .then(parsedResponse => this.setState({ response: parsedResponse, dirty: false }))
      .catch(error => this.setState({ responseError: error, dirty: false }));
  }

  updateEndpoint(newEndpoint) {
    this.setState({ endpointPath: newEndpoint, dirty: true });
  }

  updateMethod(newMethod) {
    this.setState({ method: newMethod, dirty: true });
  }

  updateBody(newBody) {
    this.setState({ body: newBody, dirty: true });
  }

  render() {
    const { serviceDomain, endpointPath, method, response, body, responseError, dirty } = this.state;

    return (
      createElement('form', null, [
        createElement('section', { className: 'serviceSection' }, [
          createElement('input', { onChange: event => this.updateServiceDomain(event.target.value), value: serviceDomain }),
        ]),
        createElement('section', { className: 'endpointSection' }, [
          createElement('select', { onChange: event => this.updateEndpoint(event.target.value), value: endpointPath }, [
            createElement('option', { value: '/chapter/getActiveIds' }, 'List Chapter Ids'),
            createElement('option', { value: '/chapter/addNewChapter' }, 'Create New Chapter'),
          ]),
          createElement('select', { onChange: event => this.updateMethod(event.target.value), value: method }, [
            createElement('option', { value: 'POST' }, 'Post'),
            createElement('option', { value: 'GET' }, 'Get'),
            createElement('option', { value: 'PUT' }, 'Put'),
            createElement('option', { value: 'PATCH' }, 'Patch'),
          ]),
          createElement('pre', { className: 'urlPreview' }, `${method} => ${serviceDomain}${endpointPath}`),
        ]),
        createElement('section', { className: 'requestSection' }, [
          (method === 'POST' || method === 'PUT' || method === 'PATCH') &&
            createElement('section', { className: 'bodySection' }, [
              createElement('textarea', { onChange: event => this.updateBody(event.target.value), className: 'bodyInput' }),
              createElement('pre', { className: 'bodyPreview' }, tryPrettyStringify(body)),
            ]),
          createElement('button', { onClick: event => this.makeRequest(event) }, 'Request'),
        ]),
        createElement('section', { className: `responseSection ${dirty ? 'dirty' : ''}` }, [
          response !== null && responseError === null && createElement('pre', null, response),
          responseError !== null && createElement('pre', null, responseError.message),
        ]),
      ])
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    createElement(App),
    document.body.appendChild(document.createElement('div'))
  )
});

// 2 3 (1) 1 2 3 (4) = 16