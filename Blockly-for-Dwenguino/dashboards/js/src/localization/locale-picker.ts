/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, PropertyValueMap, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {getLocale, setLocaleFromUrl} from './localization';
import {allLocales} from '../../../generated/locale-codes'
import {localized, msg} from '@lit/localize';


import '@vaadin/select';


// Note we use updateWhenLocaleChanges here so that we're always up to date with
// the active locale (the result of getLocale()) when the locale changes via a
// history navigation.
@localized()
@customElement('locale-picker')
export class LocalePicker extends LitElement {


  @state()
  locales:any[] = [];

  initLocales() {
    this.locales = [
      {
        label: 'English',
        value: 'en',
      },
      {
        label: 'Nederlands',
        value: 'nl',
      },
      {
        label: 'Français',
        value: 'fr',
      },
      {
        label: 'Deutsch',
        value: 'de',
      },
    ];
  }

  constructor() {
    super();
    this.initLocales();
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.initLocales() // Hack to make translation work
  }

  render() {
    return html`
      <vaadin-select 
        label=${msg('Language')}
        .value=${getLocale()}
        .items=${this.locales}
        @change=${this.localeChanged}
      >
    `;
  }

  localeChanged(event: Event) {
    const newLocale = (event.target as HTMLSelectElement).value;
    if (newLocale !== getLocale()) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLocale);
      window.history.pushState(null, '', url.toString());
      setLocaleFromUrl();
    }
  }
}
