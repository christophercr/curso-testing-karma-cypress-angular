module.exports = {
  /**
   * The line length where Prettier will try wrap.
   * Default: `80`
   *
   * See: https://prettier.io/docs/en/options.html#print-width
   */
  printWidth: 140,

  /**
   * Number of spaces per indentation level.
   * Default: `2`
   *
   * See: https://prettier.io/docs/en/options.html#tab-width
   */
  tabWidth: 2,

  /**
   * Indent with tabs instead of spaces.
   * Default: `false`
   *
   * See: https://prettier.io/docs/en/options.html#tabs
   */
  useTabs: false,

  /**
   * Change when properties in objects are quoted.
   * Default: `as-needed`
   *
   * See: https://prettier.io/docs/en/options.html#quote-props
   */
  quoteProps: "as-needed",

  /**
   * Print trailing commas wherever possible when multi-line.
   * Default: `"es5"`
   *
   * See: https://prettier.io/docs/en/options.html#trailing-commas
   */
  trailingComma: "all",

  /**
   * Print spaces between brackets.
   * Default: `true`
   *
   * See: https://prettier.io/docs/en/options.html#bracket-spacing
   */
  bracketSpacing: true,

  /**
   * Specify the global whitespace sensitivity for HTML, Vue, Angular, and Handlebars.
   * Default: `css`
   *
   * See: https://prettier.io/docs/en/options.html#html-whitespace-sensitivity
   */
  htmlWhitespaceSensitivity: "strict",

  /**
   * Which end of line characters to apply.
   * Default: `lf`
   *
   * See: https://prettier.io/docs/en/options.html#end-of-line
   */
  endOfLine: "auto",

  /**
   * Include parentheses around a sole arrow function parameter.
   * Default: `"always"`
   *
   * See: https://prettier.io/docs/en/options.html#arrow-function-parentheses
   */
  arrowParens: "always",

  /**
   * Control how Prettier formats quoted code embedded in the file.
   * Default: `"auto"`
   *
   * See: https://prettier.io/docs/en/options.html#embedded-language-formatting
   */
  embeddedLanguageFormatting: "auto",
  plugins: ["prettier-plugin-json-formats"],
  overrides: [
    {
      files: "package.json",
      options: {
        parser: "package-json",
      },
    },
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
