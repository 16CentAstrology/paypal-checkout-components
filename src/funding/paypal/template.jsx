/* @flow */
/** @jsx node */

import {
  node,
  Fragment,
  Style,
  type ChildType,
} from "@krakenjs/jsx-pragmatic/src";
import { getCSPNonce } from "@paypal/sdk-client/src";
import {
  PPLogoExternalImage,
  PPLogoInlineSVG,
  PayPalLogoExternalImage,
  PayPalRebrandLogoExternalImage,
  PayPalLogoInlineSVG,
  PayPalRebrandLogoInlineSVG,
  CreditLogoExternalImage,
  CreditLogoInlineSVG,
  CreditMarkExternalImage,
  CreditMarkInlineSVG,
  PayPalMarkExternalImage,
  PayPalMarkInlineSVG,
  GlyphCardExternalImage,
  GlyphCardInlineSVG,
  GlyphBankExternalImage,
  GlyphBankInlineSVG,
  LOGO_CLASS,
} from "@paypal/sdk-logos/src";
import { FUNDING, WALLET_INSTRUMENT } from "@paypal/sdk-constants/src";

import {
  type LogoOptions,
  type LabelOptions,
  type WalletLabelOptions,
  type TagOptions,
  BasicLabel,
} from "../common";
import { CLASS, ATTRIBUTE, BUTTON_LAYOUT } from "../../constants";
import { componentContent } from "../content";
import { Text, PlaceHolder } from "../../ui/text";
import { TrackingBeacon } from "../../ui/tracking";
import {
  HIDDEN,
  VISIBLE,
  COMPRESSED,
  EXPANDED,
} from "../../ui/buttons/styles/labels";

import css from "./style.scoped.scss";

export function Logo({
  logoColor,
  shouldApplyRebrandedStyles,
}: LogoOptions): ChildType {
  if (!shouldApplyRebrandedStyles) {
    // csnw globals.js
    return __WEB__ ? (
      // helps reduce bundle size by fetching logos
      <PayPalLogoExternalImage logoColor={logoColor} />
    ) : (
      // cdnx/sdk-logo/xxxx/paypal-gold.svg
      // use for server side rendering
      <PayPalLogoInlineSVG logoColor={logoColor} />
    );
  }

  // csnw globals.js
  return __WEB__ ? (
    // helps reduce bundle size by fetching logos
    <PayPalRebrandLogoExternalImage logoColor={logoColor} />
  ) : (
    // cdnx/sdk-logo/xxxx/paypal-gold.svg
    // use for server side rendering
    <PayPalRebrandLogoInlineSVG logoColor={logoColor} />
  );
}

function getPersonalizationText({
  personalization,
  layout,
  multiple,
}: LabelOptions): ?string {
  const personalizationText =
    personalization &&
    personalization.buttonText &&
    personalization.buttonText.text;

  if (!personalizationText) {
    return;
  }

  if (personalizationText.match(/[{}]/)) {
    return;
  }

  if (layout === BUTTON_LAYOUT.HORIZONTAL && multiple) {
    return;
  }

  return personalizationText;
}

function getPersonalizationTracker({ personalization }: LabelOptions): ?string {
  const personalizationTracker =
    personalization &&
    personalization.buttonText &&
    personalization.buttonText.tracking &&
    personalization.buttonText.tracking.impression;

  if (!personalizationTracker) {
    return;
  }

  return personalizationTracker;
}

function getButtonPersonalizationStyle(opts: LabelOptions): ?ChildType {
  if (__TEST__) {
    return null;
  }

  const { tagline } = opts;

  const personalizationText = !tagline && getPersonalizationText(opts);

  const MIN_WIDTH = 300;
  const PERSONALIZATION_DURATION = 5;

  const PAYPAL_BUTTON = `.${CLASS.BUTTON}[${ATTRIBUTE.FUNDING_SOURCE}=${FUNDING.PAYPAL}]`;

  return (
    <style
      innerHTML={`
            @media only screen and (max-width: ${MIN_WIDTH}px) {
                .${CLASS.DOM_READY} ${PAYPAL_BUTTON} .${
        CLASS.PERSONALIZATION_TEXT
      } {
                    ${HIDDEN}
                }
            }

            @media only screen and (min-width: ${MIN_WIDTH}px) {
                .${CLASS.DOM_READY} ${PAYPAL_BUTTON} .${LOGO_CLASS.LOGO}.${
        LOGO_CLASS.LOGO
      }-${FUNDING.PAYPAL} {
                    animation: ${
                      personalizationText
                        ? `toggle-paypal-logo ${PERSONALIZATION_DURATION}s 0s forwards`
                        : `none`
                    };
                }

                .${CLASS.DOM_READY} ${PAYPAL_BUTTON} .${CLASS.TEXT}:not(.${
        CLASS.PERSONALIZATION_TEXT
      }):not(.${CLASS.HIDDEN}) {
                    ${COMPRESSED}
                    ${VISIBLE}
                    animation: ${
                      personalizationText
                        ? `show-text-delayed ${PERSONALIZATION_DURATION}s 0s forwards`
                        : `show-text 1s 0s forwards`
                    };
                }

                .${CLASS.DOM_READY} ${PAYPAL_BUTTON} .${
        CLASS.PERSONALIZATION_TEXT
      } {
                    ${COMPRESSED}
                    ${VISIBLE}
                    animation: show-personalization-text ${PERSONALIZATION_DURATION}s 0s forwards;
                }
            }

            @keyframes toggle-paypal-logo {
                0% { ${EXPANDED} }
                15% { ${COMPRESSED} }
                85% { ${COMPRESSED} }
                100% { ${EXPANDED} }
            }

            @keyframes show-text-delayed {
                0% { ${COMPRESSED} }
                85% { ${COMPRESSED} }
                100% { ${EXPANDED} }
            }

            @keyframes show-personalization-text {
                0% { ${COMPRESSED} }
                15% { ${COMPRESSED} }
                25% { ${EXPANDED} }
                70% { ${EXPANDED} }
                85% { ${COMPRESSED} }
                100% { ${COMPRESSED} }
            }
        `}
    />
  );
}

function ButtonPersonalization(opts: LabelOptions): ?ChildType {
  if (__WEB__) {
    return;
  }

  const { nonce, tagline, label } = opts;

  if (tagline || !label) {
    return;
  }

  const personalizationText = getPersonalizationText(opts);
  const personalizationTracker = getPersonalizationTracker(opts);

  if (!personalizationText) {
    return;
  }

  return (
    <Fragment>
      <Text className={[CLASS.PERSONALIZATION_TEXT]} optional={2}>
        {personalizationText}
      </Text>
      {personalizationTracker && (
        <TrackingBeacon url={personalizationTracker} nonce={nonce} />
      )}
      {getButtonPersonalizationStyle(opts)}
    </Fragment>
  );
}

export function Label(opts: LabelOptions): ChildType {
  return (
    <Fragment>
      <BasicLabel {...opts} />
      <ButtonPersonalization {...opts} />
    </Fragment>
  );
}

export function WalletLabelOld(opts: WalletLabelOptions): ?ChildType {
  const { logoColor, instrument, locale, content, commit } = opts;

  if (__WEB__) {
    return;
  }

  if (!instrument) {
    throw new Error(`Expected instrument`);
  }

  let logo;

  if (instrument.logoUrl) {
    logo = <img class="card-art" src={instrument.logoUrl} />;
  } else if (instrument.type === WALLET_INSTRUMENT.CARD) {
    logo = __WEB__ ? (
      <GlyphCardExternalImage logoColor={logoColor} />
    ) : (
      <GlyphCardInlineSVG logoColor={logoColor} />
    );
  } else if (instrument.type === WALLET_INSTRUMENT.BANK) {
    logo = __WEB__ ? (
      <GlyphBankExternalImage logoColor={logoColor} />
    ) : (
      <GlyphBankInlineSVG logoColor={logoColor} />
    );
  } else if (instrument.type === WALLET_INSTRUMENT.CREDIT) {
    logo = __WEB__ ? (
      <CreditLogoExternalImage locale={locale} logoColor={logoColor} />
    ) : (
      <CreditLogoInlineSVG locale={locale} logoColor={logoColor} />
    );
  }

  const cspNonce = __WEB__ ? getCSPNonce() : undefined;

  return (
    <Style nonce={cspNonce} css={css}>
      <div class="wallet-label">
        <div class="paypal-mark">
          {__WEB__ ? (
            <PPLogoExternalImage logoColor={logoColor} />
          ) : (
            <PPLogoInlineSVG logoColor={logoColor} />
          )}
        </div>
        {instrument.oneClick && commit && content && (
          <div class="pay-label">
            <Text>{content.payNow}</Text>
          </div>
        )}
        <div class="paypal-wordmark">
          {__WEB__ ? (
            <PayPalLogoExternalImage logoColor={logoColor} />
          ) : (
            <PayPalLogoInlineSVG logoColor={logoColor} />
          )}
        </div>
        <div class="divider">|</div>
        {logo && (
          <div class="logo" optional>
            {logo}
          </div>
        )}
        <div class="label">
          <Text className={["limit"]}>{instrument.label}</Text>
        </div>
      </div>
    </Style>
  );
}

function ShowPayLabel(opts): ?ChildType {
  const { instrument, content, payNow, textColor, logo, label } = opts;

  return (
    <div class="show-pay-label">
      <div class="pay-label" optional={2}>
        {instrument && content ? (
          <Text>{payNow ? content.payNow : content.payWith}</Text>
        ) : (
          <Text>
            <PlaceHolder chars={7} color={textColor} />
          </Text>
        )}
      </div>
      <div class="logo" optional={1}>
        {instrument && logo ? (
          logo
        ) : (
          <Text>
            <PlaceHolder chars={4} color={textColor} />
          </Text>
        )}
      </div>
      <div class="label">
        {instrument && label ? (
          <Text>{label}</Text>
        ) : (
          <Text>
            <PlaceHolder chars={6} color={textColor} />
          </Text>
        )}
      </div>
    </div>
  );
}

function ShowInstrumentsOnFile(opts): ?ChildType {
  const { instrument, textColor, logo, label, content } = opts;

  return (
    <div class="show-instruments-on-file">
      {instrument?.secondaryInstruments?.[0] ? (
        <div class="balance">
          <Text>{content?.balance} &</Text>
        </div>
      ) : null}
      {instrument?.type === "balance" ? (
        <div class="paypal-balance">
          <Text>{content?.payPalBalance}</Text>
        </div>
      ) : (
        <div class="fi-container">
          <div class="fi-logo">
            {instrument && logo ? (
              logo
            ) : (
              <Text>
                <PlaceHolder chars={4} color={textColor} />
              </Text>
            )}
          </div>
          <div class="fi-label">
            {instrument && label ? (
              <Text>{label}</Text>
            ) : (
              <Text>
                <PlaceHolder chars={6} color={textColor} />
              </Text>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function WalletLabel(opts: WalletLabelOptions): ?ChildType {
  const {
    logoColor,
    instrument,
    content,
    commit,
    vault,
    textColor,
    fundingSource,
    showPayLabel,
  } = opts;

  if (instrument && !instrument.type) {
    return WalletLabelOld(opts);
  }

  let logo;
  let label;
  let branded;

  if (instrument && typeof instrument.branded === "boolean") {
    branded = instrument.branded;
  } else if (
    fundingSource === FUNDING.PAYPAL ||
    fundingSource === FUNDING.CREDIT
  ) {
    branded = true;
  } else if (fundingSource === FUNDING.CARD) {
    branded = false;
  } else {
    branded = true;
  }

  if (instrument) {
    const cardSVG = __WEB__ ? (
      <GlyphCardExternalImage logoColor={logoColor} />
    ) : (
      <GlyphCardInlineSVG logoColor={logoColor} />
    );
    const bankSVG = __WEB__ ? (
      <GlyphBankExternalImage logoColor={logoColor} />
    ) : (
      <GlyphBankInlineSVG logoColor={logoColor} />
    );

    if (instrument.type === WALLET_INSTRUMENT.CARD && instrument.label) {
      logo = instrument.logoUrl ? (
        <img class="card-art" src={instrument.logoUrl} />
      ) : (
        cardSVG
      );

      label = instrument.label.replace("••••", "••");
    } else if (instrument.type === WALLET_INSTRUMENT.BANK && instrument.label) {
      logo = instrument.logoUrl ? (
        <img class="card-art" src={instrument.logoUrl} />
      ) : (
        bankSVG
      );

      label = instrument.label.replace("••••", "••");
    } else if (instrument.type === WALLET_INSTRUMENT.CREDIT) {
      logo = __WEB__ ? <CreditMarkExternalImage /> : <CreditMarkInlineSVG />;

      label = content && content.credit;
    } else if (instrument.type === WALLET_INSTRUMENT.BALANCE) {
      logo = __WEB__ ? <PayPalMarkExternalImage /> : <PayPalMarkInlineSVG />;

      label = content && content.balance;
    } else if (instrument.label) {
      label = instrument.label;
    }
  }

  const payNow = Boolean(instrument && instrument.oneClick && commit && !vault);

  const attrs = {};
  if (payNow) {
    attrs[ATTRIBUTE.PAY_NOW] = true;
  }

  const cspNonce = __WEB__ ? getCSPNonce() : undefined;

  return (
    <Style nonce={cspNonce} css={css}>
      <div class="wallet-label-new" {...attrs}>
        {branded ? (
          <div class="paypal-mark">
            {__WEB__ ? (
              <PPLogoExternalImage logoColor={logoColor} />
            ) : (
              <PPLogoInlineSVG logoColor={logoColor} />
            )}
          </div>
        ) : null}
        {showPayLabel ? (
          <ShowPayLabel
            instrument={instrument}
            content={content}
            payNow={payNow}
            textColor={textColor}
            logo={logo}
            label={label}
          />
        ) : (
          <ShowInstrumentsOnFile
            instrument={instrument}
            textColor={textColor}
            logo={logo}
            label={label}
            content={content}
          />
        )}
      </div>
    </Style>
  );
}

export function Tag({ multiple, locale: { lang } }: TagOptions): ?ChildType {
  if (__WEB__) {
    return null;
  }

  const { DualTag, SaferTag } = componentContent[lang];

  return multiple && DualTag ? <DualTag optional /> : <SaferTag optional />;
}
