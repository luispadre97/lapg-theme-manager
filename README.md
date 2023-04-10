# lapg-theme-manager Library

lapg-theme-manager is a lightweight library that allows you to easily apply and switch between themes in your web applications. It can be used with React, Vue, or any other framework that supports the use of CDN.

## Usage

To start using LAPG, include the library in your HTML file using the following script tag:

```
<script src="https://unpkg.com/lapg@1.0.0/dist/lapg.min.js"></script>
```

Alternatively, you can use a different version or download the library and host it locally.

### Loading Themes

Before you can apply themes, you need to load them into the `ThemeContext` object. You can do this by calling the `loadThemeFromJSON` function and passing in a theme name and a JSON object containing the styles for that theme. For example:

```json
lapg().loadThemeFromJSON('light', {
  'body': {
    'background-color': '#FFFFFF',
    'color': '#000000',
  },
  'button': {
    'background-color': '#FFFFFF',
    'color': '#000000',
    'border': '1px solid #000000',
  },
});
```

### Applying Themes

To apply a theme, call the `setTheme` function and pass in the name of the theme you want to apply. For example:

```javascript
lapg().ThemeContext.setTheme('light');
```

### Using Dynamic Styles

To apply styles dynamically, add the `data-dynamic-style` attribute to any element that you want to apply styles to. You can also add a `data-theme` attribute to specify which theme to use. For example:

```html
<button data-dynamic-style data-theme="light">Click me</button>
```

### Listening to Events

You can listen to events using the `on` function. For example:

```javascript
lapg().on('themeChanged', (themeName) => {
  console.log(`Theme changed to ${themeName}`);
});
```

### Emitting Events

You can emit events using the `emit` function. For example:

```javascript
lapg().emit('themeChanged', 'dark');
```

## Examples

Here are some basic examples of how to use lapg-theme-manager:

### React

```react
import React from 'react';
import ReactDOM from 'react-dom';
import lapg from 'lapg-theme-manager';

function App() {
	const { loadThemeFromJSON, ThemeContext } = lapg()

	React.useEffect(() => {
		loadThemeFromJSON("light", {
			body: {
				"background-color": "#FFFFFF",
				color: "#000000",
			},
			button: {
				"background-color": "#FFFFFF",
				color: "#000000",
				border: "1px solid #000000",
			},
		})
		loadThemeFromJSON("dark", {
			body: {
				"background-color": "#000000",
				color: "#FFFFFF",
			},
			button: {
				"background-color": "#000000",
				color: "#FFFFFF",
				border: "1px solid #FFFFFF",
			},
		})
	}, [])
	const handleButtonClick = () => {
		const currentTheme =
			ThemeContext.currentTheme === "light" ? "dark" : "light"
		ThemeContext.setTheme(currentTheme)
	}
	return (
		<>
			<div>
				<h1>Theme Example</h1>
				<button data-dynamic-style onClick={handleButtonClick}>
					Toggle Theme
				</button>
			</div>
		</>
	)
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### Vue

```vue
<script setup>
import lapg from 'lapg-theme-manager'
import { onMounted } from 'vue';
const { ThemeContext, loadThemeFromJSON } = lapg();

onMounted(() => {
  loadThemeFromJSON('light', {
    div: {
      'background-color': '#FFFFFF',
      color: '#000000',
    },
    button: {
      'background-color': '#FFFFFF',
      color: '#000000',
      border: '1px solid #000000',
    },
  });
  loadThemeFromJSON('dark', {
    div: {
      'background-color': '#000000',
      color: '#FFFFFF',
    },
    button: {
      'background-color': 'red',
      color: '#FFFFFF',
      border: '1px solid #FFFFFF',
    },
  });
  ThemeContext.setTheme('light');
  ThemeContext.updateTheme();
});

const handleButtonClick = () => {
  console.log("args")
  const currentTheme = ThemeContext.currentTheme === 'light' ? 'dark' : 'light';
  ThemeContext.setTheme(currentTheme);
};

</script>

<template>
  <div data-dynamic-style>
    <h1>¡Hola mundo!</h1>
    <p>Este es un ejemplo de cómo cambiar el tema de una página web con LAPG en Vue 3.</p>
    <button data-dynamic-style @click="handleButtonClick">Cambiar tema</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

```

## License

LAPG is licensed under the MIT License. See LICENSE.txt for more information.

