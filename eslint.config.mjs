// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['app/**/*.vue', 'app/**/*.ts', 'test/**/*.ts', 'shared/**/*.ts', 'server/**/*.ts', '*.mjs'],
  rules: {
    'vue/multi-word-component-names': 'off',
    semi: ['error', 'never'],
  },
})
