const path = require("path");
const fs = require("fs");

const pluginName = "SingleSpaGenerateImports";

const joinURL = (baseUrl = '', filename = '') => {
  const base = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  const name = filename.startsWith('/') ? filename.substring(1, filename.length) : filename;
  return base + '/' + name;
}
module.exports = class SingleSpaGenerateImports {
  static defaultOptions = {
    packageName: null,
    staticPath: process.env.STATIC_PATH,
    filename: "importmap.json",
  };

  constructor(options = {}) {
    this.options = { ...SingleSpaGenerateImports.defaultOptions, ...options };
    console.log();
  }
  apply(compiler) {
    compiler.hooks.done.tap(pluginName, ({ compilation }) => {
      const staticPath = this.options.staticPath || process.env.STATIC_PATH;
      const outputPath = compilation.outputOptions.path;

      if (!this.options.packageName || !staticPath) {
        throw new Error(
          pluginName + ': "packageName" and "staticPath" options are required!'
        );
      }
      const importmap = {};
      const assets = Array.from(compilation.assetsInfo.keys());

      if (typeof this.options.packageName === "string") {
        const filename = assets.find((item) => item.endsWith(".js"));
        importmap.imports = {
          [this.options.packageName]: joinURL(staticPath, filename),
        };
      } else if (typeof this.options.packageName === "object") {
        importmap.imports = {};
        Object.keys(this.options.packageName).map((name) => {
          const filename = assets.find(
            (item) => item.startsWith(name) && item.endsWith(".js")
          );
          if (filename) {
            importmap.imports[this.options.packageName[name]] = joinURL(staticPath, filename);
          }
        });
      } else {
        throw new Error(
          pluginName + ': "packageName" must be a string or an object map!'
        );
      }

      if (importmap.imports && Object.keys(importmap.imports).length) {
        fs.writeFileSync(
          path.join(outputPath, this.options.filename),
          JSON.stringify(importmap)
        );
      }
    });
  }
};
