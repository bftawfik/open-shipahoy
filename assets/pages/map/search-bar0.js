import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-input/paper-input.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

import '../../ship-ahoy-icons.js'
import '../../ship-ahoy-shared-styles.js'

import { store } from '../../redux/store.js'
import {
  vesselsSelector,
  vesselGroupsSelector,
  selectedVesselSelector
} from '../../redux/vessels/vessels-selectors.js'
import { selectVessel } from '../../redux/vessels/vessels-actions.js'

class SearchBar extends PolymerElement {
  static get is() { return 'search-bar' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles paper-material-styles">
        :host {
          display: block;
          @apply --layout-horizontal;
          @apply --layout-justified;
          @apply --paper-material-elevation-5;
        }
        a {
          text-decoration: none;
          @apply --layout-horizontal;
          @apply --layout-flex;
        }
        a paper-button,
        a:active paper-button,
        a:visited paper-button {
          @apply --layout-flex;
          text-transform: none;
          color: var(--paper-indigo-a400);
        }
      </style>
      <paper-input type="search" placeholder="search for vessels" on-value-changed="{{_onValueChange.bind(this)}}">
        <paper-icon-button slot="suffix" icon="search"></paper-icon-button>
      </paper-input>
    `
  }

  static get properties() {
    return {
      _vesselGroups: Array,
      _vessels: Array,
      _selectedVessel: {
        type: Object,
        observer: '_selectedVesselObserver',
      },
      _previouslySelectedGroupIndex: Number,
    }
  }

  _onValueChange(event) {
    console.log(event.target.value);
    console.log(store);
    console.log(this._vesselGroups);

    // event.preventDefault()
    // event.stopPropagation()
    // const vessel = event.model.vessel
    // if (vessel.mmsi == this.selectedVesselMmsi) return
    // store.dispatch(selectVessel(vessel))
  }

  _stateChanged(state) {
    this._selectedVessel = selectedVesselSelector(state)
    this._vesselGroups = vesselGroupsSelector(state)
    this._vessels = vesselsSelector(state)
    console.log(this._vesselGroups);
  }
}

window.customElements.define(SearchBar.is, SearchBar)
