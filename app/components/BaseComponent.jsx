import React from 'react';

class BaseComponent extends React.Component {
  bindAll(...methods) {
    methods.forEach( (method) => this[method] = this[method].bind(this) );
  }
}

module.exports = BaseComponent;
