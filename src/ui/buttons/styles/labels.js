/* @flow */

import { CLASS } from "../../../constants";

export const COMPRESSED = `
    max-width: 0%;
    opacity: 0;
    overflow: hidden;
`;

export const EXPANDED = `
    max-width: 100%;
    opacity: 1;
`;

export const HIDDEN = `
    position: absolute;
    visibility: hidden;
`;

export const VISIBLE = `
    position: static;
    visibility: visible;
`;

export const labelStyle = `

    .${CLASS.BUTTON} .${CLASS.TEXT} {
        ${HIDDEN}
    }

    .${CLASS.BUTTON} .${CLASS.TEXT}.${CLASS.IMMEDIATE}:not(.${
  CLASS.PERSONALIZATION_TEXT
}):not(.${CLASS.HIDDEN}) {
        ${VISIBLE}
        ${EXPANDED}
    }

    .${CLASS.BUTTON} .${CLASS.VAULT_LABEL} {
        max-width: 60%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .${CLASS.DOM_READY} .${CLASS.BUTTON} .${CLASS.TEXT}:not(.${
  CLASS.IMMEDIATE
}):not(.${CLASS.PERSONALIZATION_TEXT}):not(.${CLASS.HIDDEN}) {
        ${VISIBLE}
        ${COMPRESSED}
        animation: show-text ${__TEST__ ? "0" : "1"}s 0s forwards;
    }

    @keyframes show-text {
        0% { ${COMPRESSED} }
        100% { ${EXPANDED} }
    }

    .${CLASS.BUTTON_LABEL} {
        font-family: system-ui, -apple-system, Roboto, "Segoe UI", Helvetica-Neue, Helvetica, Arial, sans-serif;
        font-weight: 500;
    }

    .${CLASS.BUTTON_REBRAND} .${CLASS.BUTTON_LABEL} {
        font-family: PayPal Pro Book, system-ui, -apple-system, Roboto, "Segoe UI", Helvetica-Neue, Helvetica, Arial, sans-serif;
    }

    .${CLASS.BUTTON_REBRAND} div[data-funding-source=venmo] .${
  CLASS.BUTTON_LABEL
} {
        font-family: Scto Grotesk A, system-ui, -apple-system, Roboto, "Segoe UI", Helvetica-Neue, Helvetica, Arial, sans-serif;
    }
`;
