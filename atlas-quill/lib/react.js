import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';
import htm from 'https://dev.jspm.io/htm';

const { Component, Fragment, createContext, useState, useEffect } = React;
const { render } = ReactDOM;
const jsx = htm.bind(React.createElement);

export {
  render,
  useState,
  useEffect,
  Component,
  Fragment,
  jsx,
  createContext,
};
