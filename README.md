# single-spa-generate-imports-webpack
A webpack plugin which allow to generate importmap.json with output filename for single-spa application on compile.

## Installation

```
npm install --save-dev single-spa-generate-imports-webpack
```

## Usage

In config file:

``` javascript
const SingleSpaGenerateImports = require('single-spa-generate-imports-webpack');
// ...
  module: {
    plugins: [
      new SingleSpaGenerateImports({
        packageName: '@org/core', // required
        staticPath: 'http://some.url/point/to/your/import/path', // default from env process.env.STATIC_PATH
        filename: 'importmap.json'
      }),
    ]
  },
// ...
```

Generate file:

``` javascript
// dist/importmap.json
{
  imports: {
    "@org/core": "http://some.url/point/to/your/import/path/org-core.<hash>.js"
  }
}
```

Multi Entry points:

``` javascript
const SingleSpaGenerateImports = require('single-spa-generate-imports-webpack');
// ...
  module: {
    entry: {
      'org-styleguide': `./src/main.ts`,
      'styles': `./src/styles.ts`,
    }
    ...
    plugins: [
      new SingleSpaGenerateImports({
        packageName: {
          'org-styleguide': '@org/styleguide',
          'styles': '@org/styleguide/styles',
          ...
        }
        ...
      }),
    ]
  },
// ...
```
Generate file multi imports:

``` javascript
// dist/importmap.json
{
  imports: {
    "@org/styleguide": "http://some.url/point/to/your/import/path/org-styleguide.<hash>.js"
    "@org/styleguide/styles": "http://some.url/point/to/your/import/path/styles.<hash>.js"
    ...
  }
}
```
