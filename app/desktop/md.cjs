var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  defaultOptions: () => defaultOptions
});
module.exports = __toCommonJS(src_exports);
var import_remark_gfm = __toESM(require("remark-gfm"), 1);
var import_rehype_highlight = __toESM(require("rehype-highlight"), 1);

// ../../node_modules/unist-util-is/index.js
var convert = function(test) {
  if (test === void 0 || test === null) {
    return ok;
  }
  if (typeof test === "string") {
    return typeFactory(test);
  }
  if (typeof test === "object") {
    return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
  }
  if (typeof test === "function") {
    return castFactory(test);
  }
  throw new Error("Expected function, string, or object as test");
};
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].call(this, ...parameters))
        return true;
    }
    return false;
  }
}
function propsFactory(check) {
  return castFactory(all);
  function all(node) {
    let key;
    for (key in check) {
      if (node[key] !== check[key])
        return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(check) {
  return assertion;
  function assertion(...parameters) {
    return Boolean(check.call(this, ...parameters));
  }
}
function ok() {
  return true;
}

// ../../node_modules/unist-util-visit/node_modules/unist-util-visit-parents/color.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m";
}

// ../../node_modules/unist-util-visit/node_modules/unist-util-visit-parents/index.js
var CONTINUE = true;
var SKIP = "skip";
var EXIT = false;
var visitParents = function(tree, test, visitor, reverse) {
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
    test = null;
  }
  const is = convert(test);
  const step = reverse ? -1 : 1;
  factory(tree, null, [])();
  function factory(node, index, parents) {
    const value = typeof node === "object" && node !== null ? node : {};
    let name;
    if (typeof value.type === "string") {
      name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : void 0;
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(value.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit2;
    function visit2() {
      let result = [];
      let subresult;
      let offset;
      let grandparents;
      if (!test || is(node, index, parents[parents.length - 1] || null)) {
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if (node.children && result[0] !== SKIP) {
        offset = (reverse ? node.children.length : -1) + step;
        grandparents = parents.concat(node);
        while (offset > -1 && offset < node.children.length) {
          subresult = factory(node.children[offset], offset, grandparents)();
          if (subresult[0] === EXIT) {
            return subresult;
          }
          offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
        }
      }
      return result;
    }
  }
};
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return [value];
}

// ../../node_modules/unist-util-visit/index.js
var visit = function(tree, test, visitor, reverse) {
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
    test = null;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    return visitor(node, parent ? parent.children.indexOf(node) : null, parent);
  }
};

// src/plugins/mermaid.ts
function mermaidPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "code" && node.lang === "mermaid") {
        node.type = "block";
        node.children = [
          {
            type: "text",
            value: node.value
          }
        ];
        const data = node.data || (node.data = {});
        data.hName = "pre";
        data.hProperties = { className: "mermaid" };
      }
    });
  };
}

// src/index.ts
var import_fs = require("fs");
var import_path = require("path");

// src/build.ts
var import_server = require("react-dom/server");
var runtime = __toESM(require("react/jsx-runtime"), 1);
var import_mdx = require("@mdx-js/mdx");
var import_react = require("react");
function build(body, options) {
  const mdx = (0, import_mdx.evaluateSync)(body, __spreadProps(__spreadValues({}, runtime), {
    remarkPlugins: options.remarkPlugins,
    rehypePlugins: options.rehypePlugins
  })).default;
  return (0, import_server.renderToString)((0, import_react.createElement)(mdx));
}

// src/parse.ts
var import_mdx2 = require("@mdx-js/mdx");
function parse(body, options) {
  try {
    const result = (0, import_mdx2.compileSync)(body, {
      format: "mdx",
      outputFormat: "function-body",
      useDynamicImport: true,
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins
    });
    return String(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// src/index.ts
var defaultOptions = {
  remarkPlugins: [mermaidPlugin, import_remark_gfm.default],
  rehypePlugins: [import_rehype_highlight.default]
};
function Md(options) {
  if (!options)
    options = {};
  options.remarkPlugins = [...options.remarkPlugins || [], ...defaultOptions.remarkPlugins];
  options.rehypePlugins = [...options.rehypePlugins || [], ...defaultOptions.rehypePlugins];
  return {
    extname: ".md",
    read({ filename }) {
      return { body: (0, import_fs.readFileSync)(filename).toString() };
    },
    write({ filename, body }) {
      (0, import_fs.writeFileSync)(filename, body);
    },
    render({ filename }) {
      const file = (0, import_fs.readFileSync)(filename).toString();
      return { body: parse(file, options) };
    },
    create({ filename }) {
      (0, import_fs.writeFileSync)(filename, `# ${(0, import_path.basename)(filename).replace(".md", "")}

`);
    },
    build({ source, destination }) {
      (0, import_fs.writeFileSync)(destination, build((0, import_fs.readFileSync)(source).toString(), options));
    }
  };
}
var src_default = Md;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultOptions
});
