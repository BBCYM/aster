module.exports = {
	'env': {
		'es6': true,
		'node': true,
		"jest": true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'react-app',
		"plugin:jsx-a11y/recommended",
		"plugin:react-hooks/recommended"
	],
	"parser": "babel-eslint",
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		babelOptions: {
			configFile: "babel.config.js",
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		"jsx-a11y",
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn"
	}
}