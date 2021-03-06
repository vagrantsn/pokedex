import { Global, css } from '@emotion/react'
import { ReactChild } from 'react'

const CSSReset = () => (
  <Global
    styles={css`
      html, body, #root {
        height: 100%;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
    `}
  />
)

const Typography = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800;900&display=swap');

      * {
        font-family: 'Roboto';
      }
    `}
  />
)

const GlobalStyles = ({ children }: { children: ReactChild }): JSX.Element => (
  <>
    <CSSReset />
    <Typography />
    {children}
  </>
)

export default GlobalStyles
