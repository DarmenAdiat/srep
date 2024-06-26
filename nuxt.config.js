import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '',
    title: 'SREP',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/National_Emblem.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
     '~/assets/css/main_styles.css'
  ],

  server: {
     host: '0.0.0.0',
     port: '3000'
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  auth: {
    strategies:{
      local: {
        scheme: 'refresh',
        localStorage: {
          prefix: 'auth.'
        },
        token: {
          prefix: 'access_token.',
          property: 'access',
          maxAge: 60,
          global: true,
          required: true,
          type: 'Bearer'
        },
        refreshToken: {
          prefix: 'refresh_token.',
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: {url: '/api/auth/token/', method: 'post'},
          // login_bin: { url: '/api/token_bin/', method: 'post' },
          refresh: {url: '/api/token/refresh/', method: 'post'},
          user: {url: '/api/user/username/', method: 'get'},
          logout: {url: '/api/token/logout/', method: 'post'},
        },
        redirect: {
          login: '/',
          logout: '/login',
        },
      },
      // local_bin: {
      //   scheme: 'refresh',
      //   localStorage: {
      //     prefix: 'auth.'
      //   },
      //   token: {
      //     prefix: 'access_token.',
      //     property: 'access',
      //     maxAge: 60,
      //     global: true,
      //     required: true,
      //     type: 'Bearer'
      //   },
      //   refreshToken:{
      //     prefix: 'refresh_token.',
      //     property: 'refresh',
      //     data: 'refresh',
      //     maxAge: 60 * 60 * 24 * 30
      //   },
      //
      //   user: {
      //     property: 'user',
      //     autoFetch: true
      //   },
      //   endpoints: {
      //     login: { url: '/api/token_bin/', method: 'post' },
      //     refresh: { url: '/api/token/refresh/', method: 'post' },
      //     user: { url: '/api/v1/profile/', method: 'get' },
      //     logout: { url: '/api/logout/', method: 'post' }
      //   },
      //   redirect: {
      //     login: '/',
      //     logout: '/',
      //     callback: '/',
      //     home: '/',
      //   },
      // }
    },
    // plugins: [ '~/plugins/auth.js' ],
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      // ...
      config.module.rules.push({
        test: /\.(gltf)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/models/' // путь, куда будут складываться обработанные файлы
        }
      });
      // ...
    }
  }
}
