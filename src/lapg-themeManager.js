(function (global) {
  const ThemeContext = {
    themes: {},
    currentTheme: null,
    styleElement: null,
    variables: null,
    loadTheme: function (themeName, theme) {
      this.themes[themeName] = theme;
    },
    setTheme: function (themeName) {
      if (!themeName) {
        console.error('No theme name provided.');
        return;
      }

      if (!this.themes[themeName]) {
        console.error(`Theme '${themeName}' not found.`);
        return;
      }

      this.currentTheme = themeName;
      this.updateTheme();
    },
    updateTheme: function () {
      if (!this.currentTheme) return;

      const theme = this.themes[this.currentTheme];
      const css = generateCSSRules(this.currentTheme, theme, this.variables);
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        this.styleElement.setAttribute('data-lazy', 'true');
        document.head.appendChild(this.styleElement);
      }
      this.styleElement.textContent = css;
      applyStyles();
    },
  };

  function generateCSSRules(themeName, theme, variables) {
    const processStyles = (selector, styles) => {
      const styleRules = [];
      const nestedRules = [];

      for (const [property, value] of Object.entries(styles)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const nestedSelector = property.startsWith('&') ? property.slice(1) : ` ${property}`;
          nestedRules.push(processStyles(`${selector}${nestedSelector}`, value));
        } else {
          const kebabProperty = camelCaseToKebabCase(property);
          const replacedValue = replaceVariables(value, variables);
          styleRules.push(`${kebabProperty}: ${replacedValue};`);
        }
      }

      const currentRule = `${selector} {${styleRules.join(' ')}}`;
      return [currentRule, ...nestedRules].join('\n');
    };

    let css = '';

    for (const [selector, styles] of Object.entries(theme)) {
      const prefixedSelector = selector.startsWith('.') ? selector : `.${themeName}-${selector}`;
      css += processStyles(prefixedSelector, styles) + '\n';
    }

    return css;
  }

  function applyStyles() {
    const elements = document.querySelectorAll('[data-dynamic-style]');

    elements.forEach((element) => {
      const themeName = element.getAttribute('data-theme') || ThemeContext.currentTheme;
      const tagName = element.tagName.toLowerCase();
      const generatedClass = `${themeName}-${tagName}`;

      const customClass = element.getAttribute('class');
      if (customClass && customClass.split(' ').some(cls => cls.startsWith(themeName))) {
        return;
      }

      element.classList.add(generatedClass);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const initialTheme = document.documentElement.getAttribute('data-theme');
    ThemeContext.setTheme(initialTheme);
  });

  function camelCaseToKebabCase(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Input must be a string');
    }
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  function replaceVariables(value, variables) {
    return value.replace(/\$([a-zA-Z0-9]+(-[a-zA-Z0-9]+)?)/g, (_, varName) => variables[varName]);
  }


  function lapg(options) {
    return {
      ThemeContext: ThemeContext,
      // loadThemeFromJSON: (themeName, themeJSON) => ThemeContext.loadTheme(themeName, themeJSON),
      // on: (eventName, callback) => document.addEventListener(`lapg:${eventName}`, (e) => {
      //   callback(e.detail);
      // }),
      // emit: (eventName, data) => document.dispatchEvent(new CustomEvent(`lapg:${eventName}`, { detail: data })),
      loadTheme: (config) =>{
        ThemeContext.loadTheme('multimarcas', { '.marca': config });
        ThemeContext.setTheme('multimarcas');
      },
    };
  }

  global.lapg = lapg;
  global.loadTheme = loadTheme;
  global.ThemeContext = ThemeContext;
})(window);

export default lapg;
