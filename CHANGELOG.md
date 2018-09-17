# Oligrapher CHANGELOG

## [0.3.8] - 2018-09-17
### changed
- update packages

## [0.3.7] - 2018-06-05
### fixed
- due to iFrame security issues, modifying the url
  via window.parent is disabled for embedded maps


## [0.3.6] - 2018-05-29
### changed
- don't modify urls when in editor mode
- upgrade libraries. Use React 16.4 and Webpack 4


## [0.3.4] - 2018-03-26
### added
- change url when navigating between tabs


## [0.3.3] - 2018-02-21
### fixed
- problem where using 'add interlocks' would create edges that cannot be moved (#4)


## [0.3.2] - 2018-02-20
### changed
- upgrade react to 16.2

## [0.3.1] - 2018-02-19
### changed
- moved all tests to ` test/ ` folder instead of using __test__
- removed depreciated testing package
- added ` npm run profile `

## [0.3.0] - 2018-02-15
### breaking change
- removed compiled version oligrapher.min.js. oligrapher.js is now the minimized version

### added
- `npm run build` also generates a source map: oligrapher.js.map
- added jshint configuration file

### changed
- removed npm scripts `build-all` and `build-min`. replaced with `build`
- upgraded to webpack 3.


## [0.2.1] - 2017-05-25
### added
- url option to configuration to enable linkable title

### removed
 - 'Click to view this...' text in embedded mode


## [0.2.0] - 2017-05-18
### added
- this changelog :)

### changed
- Updated React to 15.5
- Updated other libraries
- Use prop-types library as it is now depreciated from react's core
