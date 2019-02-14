import ReactRedux from 'https://dev.jspm.io/react-redux';
import Redux from 'https://dev.jspm.io/redux';

const { connect, Provider } = ReactRedux;
const { createStore, combineReducers, applyMiddleware, compose } = Redux;

export {
  compose,
  connect,
  Provider,
  createStore,
  combineReducers,
  applyMiddleware,
};
