/* @flow */

import type { ZalgoPromise } from "@krakenjs/zalgo-promise/src";
import type { CrossDomainWindowType } from "@krakenjs/cross-domain-utils/src";
import { FUNDING, ENV, type LocaleType } from "@paypal/sdk-constants/src";

import type {
  OnShippingAddressChange,
  OnShippingChange,
  OnShippingOptionsChange,
} from "../../ui/buttons/props";

export type OnApproveData = {|
  orderID: string,
  payerID: string,
  paymentID?: string,
|};

export type OnApproveActions = {||};

export type OnCompleteData = {||};
export type OnCompleteActions = {|
  redirect: (string, CrossDomainWindowType) => ZalgoPromise<void>,
|};
export type OnCancelData = {|
  orderID: string,
  paymentID?: string,
|};

export type OnCancelActions = {||};

export type CheckoutPropsType = {|
  createOrder: () => ZalgoPromise<string>,
  createAuthCode: () => ZalgoPromise<string>,
  onApprove: (OnApproveData, OnApproveActions) => ?ZalgoPromise<void>,
  onComplete: (OnCompleteData, OnCompleteActions) => ?ZalgoPromise<void>,
  onCancel?: (OnCancelData, OnCancelActions) => ?ZalgoPromise<void>,
  fundingSource: $Values<typeof FUNDING>,
  env: $Values<typeof ENV>,
  stage?: string,
  stageUrl?: string,
  onShippingChange: ?OnShippingChange,
  onShippingAddressChange: ?OnShippingAddressChange,
  onShippingOptionsChange: ?OnShippingOptionsChange,
  hasShippingCallback: boolean,
  locale: LocaleType,
  style: {||},
  nonce: string,
  csp: {|
    nonce: string,
  |},
  atomicsWaitingState: {|
    searchParameter: string,
    encodedState: string,
  |},
|};
