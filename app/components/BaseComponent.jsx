import { Component } from 'react';

class BaseComponent extends Component {
  bindAll(...methods) {
    methods.forEach(method => { this[method] = this[method].bind(this); });
  }
}

module.exports = BaseComponent;
