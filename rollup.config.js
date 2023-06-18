const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs").default;
const typescript = require("@rollup/plugin-typescript").default;
const { terser } = require("rollup-plugin-terser");
const external = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const dts = require("rollup-plugin-dts").default;
const fs = require("fs");

const packageJson = {
  main: "dist/cjs/index.js",
  module: "dist/esm/index.js",
  types: "dist/index.d.ts",
};

const getFolders = (entry) => {
  // get the names of folders and files of the entry directory
  let dirs = fs.readdirSync(entry);
  // ['Accordion', 'Button'...]
  dirs = dirs.map((j) => j.replace(".tsx", ""));
  return dirs;
};

//loop through your folders and generate a rollup obj per folder
const componentBuilds = () => {
  return getFolders("./src/components").map((component) => {
    return {
      input: `src/components/${component}/index.tsx`,
      output: [
        {
          file: "dist/cjs/components/" + component + "/index.js",
          format: "cjs",
          sourcemap: false,
          name: "react-ts-lib",
        },
        {
          file: "dist/esm/components/" + component + "/index.js",
          format: "esm",
          sourcemap: false,
        },
      ],
      plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: "./tsconfig.json" }),
        postcss({}),
        terser(),
      ],
      external: ["react", "react-dom"],
    };
  });
};

//loop through your folders and generate a rollup obj per folder
const componentTypeBuilds = () => {
  return getFolders("./src/components").map((component) => {
    return {
      input: `src/components/${component}/index.tsx`,
      output: [
        {
          file: "dist/esm/components/" + component + "/index.d.ts",
          format: "esm",
        },
        {
          file: "dist/cjs/components/" + component + "/index.d.ts",
          format: "esm",
        },
      ],
      external: [/\.css$/],
      plugins: [dts()],
    };
  });
};

const component = () => {
  return [...componentBuilds(), ...componentTypeBuilds()];
};

//loop through your folders and generate a rollup obj per folder
const utilBuilds = () => {
  return getFolders("./src/utils").map((component) => {
    return {
      input: `src/utils/${component}/index.ts`,
      output: [
        {
          file: "dist/cjs/utils/" + component + "/index.js",
          format: "cjs",
          sourcemap: false,
          name: "react-ts-lib",
        },
        {
          file: "dist/esm/utils/" + component + "/index.js",
          format: "esm",
          sourcemap: false,
        },
      ],
      plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: "./tsconfig.json" }),
        postcss({}),
        terser(),
      ],
      external: ["react", "react-dom"],
    };
  });
};

//loop through your folders and generate a rollup obj per folder
const utilTypeBuilds = () => {
  return getFolders("./src/utils").map((component) => {
    return {
      input: `src/utils/${component}/index.ts`,
      output: [
        {
          file: "dist/esm/utils/" + component + "/index.d.ts",
          format: "esm",
        },
        {
          file: "dist/cjs/utils/" + component + "/index.d.ts",
          format: "esm",
        },
      ],
      external: [/\.css$/],
      plugins: [dts()],
    };
  });
};

const utils = () => {
  return [...utilBuilds(), ...utilTypeBuilds()];
};

exports.default = [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: false,
        name: "react-ts-lib",
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({}),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.d.ts", format: "esm" },
      { file: "dist/cjs/index.d.ts", format: "cjs" },
      { file: "dist/esm/index.d.ts", format: "esm" },
    ],
    external: [/\.css$/],
    plugins: [dts()],
  },
  ...component(),
  ...utils(),
  {
    input: `src/hooks/Modal.tsx`,
    output: [
      {
        file: "dist/cjs/hooks/Modal.js",
        format: "cjs",
        sourcemap: false,
        name: "react-ts-lib",
      },
      {
        file: "dist/esm/hooks/Modal.js",
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({}),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: `src/hooks/Modal.tsx`,
    output: [
      {
        file: "dist/esm/hooks/Modal.d.ts",
        format: "esm",
      },
      {
        file: "dist/cjs/hooks/Modal.d.ts",
        format: "esm",
      },
    ],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
