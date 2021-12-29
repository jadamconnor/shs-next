import '../styles/globals.scss'
import "@fontsource/source-sans-pro"
import "@fontsource/source-sans-pro/300.css"
import '../node_modules/font-awesome/css/font-awesome.min.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
