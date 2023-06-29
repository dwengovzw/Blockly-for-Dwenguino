/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {configureLocalization} from '@lit/localize';
import {sourceLocale, targetLocales} from '../../../generated/locale-codes';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale: string) => import(`../../../generated/locales/${locale}`),
});

export const setLocaleFromUrl = async () => {
  const url = new URL(window.location.href);
  const locale = url.searchParams.get('lang') || targetLocales[2]; // default to nl
  // Only switch when language is supported. Otherwise, switch to english.
  if ((targetLocales as readonly string[]).includes(locale)) {
    await setLocale(locale);
  } else {
    await setLocale(sourceLocale);
  }
};