const BaseComponent = require('./BaseComponent');
const { Row } = require('react-bootstrap');

class Footer extends BaseComponent {
  render() {
    return (
      <Row className="footer">
        A project of <a href="https://littlesis.org">LittleSis.org. </a>
         Source code <a href="https://github.com/aguestuser/show-me-the-money">here.</a>
      </Row>
    );
  }
}

module.exports = Footer;
