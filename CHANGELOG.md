# Oligrapher CHANGELOG

## [0.5.2] - 2019-09-24
### changed
- Use package @public-accountability/littlesis-api
- Use localhost url while running webpack dev server

## [0.5.1] - 2019-09-19
### changed
- LsDataSource is now incorporated directly in Oligrapher's source

## [0.5.0] - 2019-09-18
### changed
- Use yarn
- Updated build script
- Publish as package (@public-accountability/oligrapher)

## [0.4.6] - 2019-09-10
### changed
- Updated dependencies
- Use React 16.9

## [0.4.5] - 2019-07-10
### fixed
- bugfix for annotation data path

## [0.4.4] - 2019-07-10
### fixed
- sets annotation pct to 0 when there are no annotations

### changed
- Updated dependencies

## [0.4.3] - 2019-06-12
### added
- embedded configuration option -- embedded.border -- toggles presence of border around the entire map

### changed
- Update dev dependencies

## [0.4.2] - 2019-06-05
### changed
- Update dependencies

## [0.4.1] - 2019-01-15
### changed
- LsDataSource is now a function and can be initialized with configuration options

## [0.4.0] - 2019-01-10
### changed
- Update dependencies
- Use babel 7


## [0.3.9] - 2018-09-18
### changed
- use bootstrap 4
- use github's octicons instead of glyicons


## [0.3.8] - 2018-09-17
### changed
- use window.top instead of window.parent when modifying url
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
