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
			'warn',
			'tab'
		],
		'linebreak-style': [
			'warn',
			'windows'
		],
		'quotes': [
			'warn',
			'single'
		],
		'semi': [
			'warn',
			'never'
		],
		"no-mixed-spaces-and-tabs": [
			'warn',
			'smart-tabs'
		],
		"react/display-name": [0],
		"react/prop-types": [0],
		"react-hooks/rules-of-hooks": [0],
		"react-hooks/exhaustive-deps": "warn"
	}
}