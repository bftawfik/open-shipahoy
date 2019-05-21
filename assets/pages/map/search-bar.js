import '@polymer/iron-collapse/iron-collapse.js'
import '@polymer/iron-list/iron-list.js'
import '@polymer/paper-button/paper-button.js'

import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';

import '@polymer/paper-item/paper-item.js'
import '../../ship-ahoy-icons.js'
import '../../ship-ahoy-shared-styles.js'
import { html } from '@polymer/polymer/polymer-element.js'
import { ContainerPrototype } from '../../container-prototype.js'
import { store } from '../../redux/store.js'
import {
  vesselsSelector,
  vesselGroupsSelector,
  selectedVesselSelector
} from '../../redux/vessels/vessels-selectors.js'
import { selectVessel } from '../../redux/vessels/vessels-actions.js'

class SearchBar extends ContainerPrototype {
  static get is() { return 'search-bar' }

  static get template() {
    return html`
      <style is="custom-style" include="shared-styles">
        :host {
          @apply --layout-flex;
          @apply --layout-vertical;
        }
        iron-list {
          max-height: 60vh;
          --iron-list-items-container: {
            @apply --layout-horizontal;
            @apply --layout-center-justified;
          };
        }
        paper-button {
          color: white;
          margin: 0.2em 0.29em;
          text-transform: none;
          min-height: 2em;
        }
        paper-item {
          border-bottom: 2px solid rgb(138, 174, 228);
          font-size: 14px;
          width: 80%;
          @apply --layout-center;
          @apply --layout-horizontal;
          @apply --layout-justified;
          --paper-item: {
            padding: 0px 8px;
          };
        }
        paper-item[active] {
          background-color: var(--paper-grey-300);
        }
        iron-list paper-item:last-child {
          border-bottom: none;
        }
        .length {
          color: gray;
          font-size: 10px;
          margin-top: 3px;
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

  _computeColorAndShow(group) {
    return `background-color: ${group.color};`;
  }

  _toggleCollapse(event) {
    const groupIndex = event.model.group.index
    if (groupIndex != this._previouslySelectedGroupIndex) {
      const previousGroup = this._selectGroupCollapseElement(this._previouslySelectedGroupIndex)
      if (previousGroup) previousGroup.hide()
    }
    const group = this._selectGroupCollapseElement(groupIndex)
    if (group) group.toggle()
    this._previouslySelectedGroupIndex = groupIndex
  }

  _selectGroupCollapseElement(index) {
    return this.shadowRoot.querySelector(`#collapse${index}`)
  }

  _selectGroupVesselsListElement(index) {
    return this.shadowRoot.querySelector(`#vesselList${index}`)
  }

  _selectVessel(event) {
    event.preventDefault()
    event.stopPropagation()
    const vessel = event.model.vessel
    if (vessel.mmsi == this.selectedVesselMmsi) return
    store.dispatch(selectVessel(vessel))
  }

  _selectedVesselObserver(selectedVessel) {
    if (selectedVessel && selectedVessel.mmsi) {
      const groupElement = this._selectGroupCollapseElement(selectedVessel.group.index)
      const listElement = this._selectGroupVesselsListElement(selectedVessel.group.index)
      const vesselGroup = this._vesselGroups.find(group => group.index == selectedVessel.group.index)
      const vesselGroupIndex = vesselGroup.vessels.findIndex(vessel => vessel.mmsi == selectedVessel.mmsi)

      if (this._previouslySelectedGroupIndex != selectedVessel.group.index) {
        const previousGroupElement = this._selectGroupCollapseElement(this._previouslySelectedGroupIndex)
        if (previousGroupElement) previousGroupElement.hide()
        groupElement.show()
        this._previouslySelectedGroupIndex = selectedVessel.group.index
      }

      if (listElement.selectedItem && listElement.selectedItem.mmsi == selectedVessel.mmsi) return
      setTimeout(() => { // to be sure that groupElement is already shown
        listElement.scrollToIndex(vesselGroupIndex)
        listElement.selectIndex(vesselGroupIndex)
      })
    } else {
      const previousList = this._selectGroupVesselsListElement(this._previouslySelectedGroupIndex)
      previousList.clearSelection()
    }
  }

  _stateChanged(state) {
    this._selectedVessel = selectedVesselSelector(state)
    this._vesselGroups = vesselGroupsSelector(state)
    this._vessels = vesselsSelector(state)
    // console.log(this._vesselGroups)
  }
}

customElements.define(SearchBar.is, SearchBar)
