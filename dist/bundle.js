(function (global) {
  const ThemeContext = {
    themes: {},
    currentTheme: null,
    styleElement: null,
    loadTheme: function (themeName, theme) {
      this.themes[themeName] = theme;
    },
    setTheme: function (themeName) {
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
      const css = generateCSSRules(this.currentTheme, theme);
      if (!this.styleElement) {
        this.styleElement = document.createElement('style');
        this.styleElement.setAttribute('data-lazy', 'true');
        document.head.appendChild(this.styleElement);
      }
      this.styleElement.textContent = css;
      applyStyles();
    },
  };

  function loadThemeFromJSON(themeName, themeJSON) {
    ThemeContext.loadTheme(themeName, themeJSON);
  }

  function camelCaseToKebabCase(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Input must be a string');
    }
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
  function generateCSSRules(themeName, theme) {
    const generateNestedRules = (selector, styles) => {
      const styleRules = [];
      const nestedRules = [];

      for (const [property, value] of Object.entries(styles)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const nestedSelector = property.startsWith('&') ? property.slice(1) : ` ${property}`;
          nestedRules.push(generateNestedRules(`${selector}${nestedSelector}`, value));
        } else {
          const kebabProperty = camelCaseToKebabCase(property);
          styleRules.push(`${kebabProperty}: ${value};`);
        }
      }

      const currentRule = `${selector} {${styleRules.join(' ')}}`;
      return [currentRule, ...nestedRules].join('\n');
    };

    let css = '';

    for (const [selector, styles] of Object.entries(theme)) {
      let prefixedSelector;

      if (selector.indexOf('.') === -1) {
        prefixedSelector = `.${themeName}-${selector}`;
      } else if (selector.startsWith('.')) {
        prefixedSelector = selector.startsWith('.') ? `.${selector.slice(1)}` : `.${themeName}-${selector}`;
      } else {
        prefixedSelector = selector;
      }

      css += generateNestedRules(prefixedSelector, styles) + '\n';
    }

    return css;
  }
  function applyStyles() {
    const elements = document.querySelectorAll('[data-dynamic-style]');

    elements.forEach((element) => {
      const customClass = element.getAttribute('class');
      let themeName = ThemeContext.currentTheme;
      if (element.hasAttribute('data-theme')) {
        themeName = element.getAttribute('data-theme');
      }

      const tagName = element.tagName.toLowerCase();
      const generatedClass = `${themeName}-${tagName}`;

      if (customClass && (customClass.includes(themeName) || customClass.split(' ').some(cls => cls.includes(themeName)))) {
        // La clase del tema actual ya existe en alguna de las clases del elemento, no hacer nada
        return;
      }

      if (customClass) {
        const newClasses = customClass.split(' ').filter((cls) => !cls.startsWith(themeName));
        newClasses.unshift(generatedClass);
        element.setAttribute('class', newClasses.join(' '));
      } else {
        element.classList.add(generatedClass);
      }
    });
  }
  function generateCSSFromClasses(classes) {
    let css = '';
    for (const [selector, styles] of Object.entries(classes)) {
      const kebabSelector = camelCaseToKebabCase(selector);
      const kebabStyles = Object.entries(styles)
        .map(([property, value]) => `${camelCaseToKebabCase(property)}: ${value};`)
        .join(' ');
      css += `.${kebabSelector} {${kebabStyles}}\n`;
    }
    return css;
  }
  function addThemeToDocument(themeName, theme) {
    const cachedStyleElement = document.querySelector(`style[data-theme="${themeName}"]`);

    if (cachedStyleElement) {
      // El CSS para este tema ya existe, no hacer nada
      return;
    }

    let css = generateCSSRules(theme);
    // Agregamos la generación de CSS a partir de clases
    if (typeof theme === 'object' && !Array.isArray(theme)) {
      css += generateCSSFromClasses(themeName);
    }
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    styleElement.setAttribute('data-theme', themeName);
    document.head.appendChild(styleElement);
  }

  function loadCSSAsync(url, callback) {
    const cachedLinkElement = document.querySelector(link[href = "${url}"]);
    if (cachedLinkElement) {
      // La hoja de estilos ya ha sido cargada, no hacer nada
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('data-lazy', 'true');
    link.setAttribute('async', 'true');
    link.addEventListener('load', callback);
    document.head.appendChild(link);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Carga perezosa de temas
    const themeElements = document.querySelectorAll('[data-theme]');
    const initialTheme = document.documentElement.getAttribute('data-theme');
    themeElements.forEach((element) => {
      const themeName = element.getAttribute('data-theme');
      const themeUrl = element.getAttribute('data-theme-url');

      if (themeName === initialTheme) {
        // El tema inicial ya está cargado, no cargarlo de nuevo
        return;
      }

      loadCSSAsync(themeUrl, () => {
        addThemeToDocument(themeName, ThemeContext.themes[themeName]);
        ThemeContext.updateTheme();
      });
    });

    // Carga asíncrona de estilos
    const styleElements = document.querySelectorAll('[data-lazy][rel="stylesheet"]');
    styleElements.forEach((element) => {
      element.setAttribute('async', 'true');
    });

    ThemeContext.updateTheme();
  });
  function on(eventName, callback) {
    document.addEventListener(`lapg:${eventName}`, (e) => {
      callback(e.detail);
    });
  }

  function emit(eventName, data) {
    document.dispatchEvent(new CustomEvent(`lapg:${eventName}`, { detail: data }));
  }

  function lapg(options) {
    return {
      ThemeContext: ThemeContext,
      loadThemeFromJSON: loadThemeFromJSON,
      on: on,
      emit: emit,
    };
  }

  global.lapg = lapg;
  global.ThemeContext = ThemeContext;
})(window);

var lapg$1 = lapg;

export { lapg$1 as default };
