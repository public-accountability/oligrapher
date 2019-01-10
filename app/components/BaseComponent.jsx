import { Component } from 'react';

export class BaseComponent extends Component {
  bindAll(...methods) {
    methods.forEach(method => { this[method] = this[method].bind(this); });
  }
}
