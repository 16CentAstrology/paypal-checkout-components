/* @flow */
/** @jsx node */

import { EpsLogoInlineSVG, EpsLogoExternalImage } from "@paypal/sdk-logos/src";
import { Fragment, node } from "@krakenjs/jsx-pragmatic/src";

import { BUTTON_LAYOUT } from "../../constants";
import {
  DEFAULT_APM_FUNDING_CONFIG,
  type FundingSourceConfig,
  BasicLabel,
} from "../common";
import { Text } from "../../ui/text";

export function getEpsConfig(): FundingSourceConfig {
  return {
    ...DEFAULT_APM_FUNDING_CONFIG,

    shippingChange: false,

    layouts: [BUTTON_LAYOUT.VERTICAL],

    Logo: ({ logoColor, optional }) => {
      if (__WEB__) {
        return EpsLogoExternalImage({ logoColor, optional });
      }

      return EpsLogoInlineSVG({ logoColor, optional });
    },

    Label: ({ logo, ...opts }) => {
      if (__WEB__) {
        return logo;
      }

      const apmLogo = (
        <Fragment>
          {logo}
          <Text animate optional>
            eps
          </Text>
        </Fragment>
      );

      return <BasicLabel {...opts} logo={apmLogo} />;
    },
  };
}
