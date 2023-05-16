import { css } from 'lit';
export const noselect = css`
.noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }`

  export const buttonStyles = css`
    .dwengo-button {
        background-color: var(--theme-accentFillSelected);
        border-radius: 2.5px;
        padding: 2.5px;
        margin: 2.5px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        cursor: pointer;
    }
    .dwengo-button-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--theme-white);
    }`

    export const iconStyle = css`
        .dwengo-icon {
            background-color: var(--theme-accentFillSelected);
            border-radius: 2.5px;
            padding: 2.5px;  
            color: white;
            font-weight: 300;
        }
        .dwengo-clickable-icon:hover {
            cursor: pointer;
        }`

    export const borderStyle = css`
        .dwengo-border {
            border: 1px solid var(--theme-accentFillSelected);
            border-radius: 5px;
        }
        .dwengo-border-highlight {
            box-shadow: 0 0 10px 0 var(--theme-accentFillSelected);
            border-width: 2px;
        }`