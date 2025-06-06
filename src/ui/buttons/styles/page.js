/* @flow */

import { CLASS } from "../../../constants";

export const pageStyle = `
    html, body {
        font-family: PayPal Plain, system-ui, -apple-system, Roboto, "Segoe UI", Helvetica-Neue, Helvetica, Arial, sans-serif;
        padding: 0;
        margin: 0;
        width: 100%;
        overflow: hidden;
        text-align: left;
    }

    body {
        display: inline-block;
        vertical-align: top;
        border-collapse: collapse;
    }

    * {
        touch-callout: none;
        user-select: none;
        cursor: default;
        box-sizing: border-box;
    }

    span {
        display: inline-block;
    }

    .${CLASS.HIDDEN} {
        position: absolute !important;
        visibility: hidden !important;
    }

    .${CLASS.HIDDEN} * {
        visibility: hidden !important;
    }
`;
