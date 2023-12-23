import { Preferences } from '@capacitor/preferences';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-weather-modal',
  templateUrl: './weather-modal.component.html',
  styleUrls: ['./weather-modal.component.scss'],
})
export class WeatherModalComponent {
  items = [
    { label: 'Czechia', checked: false, code: "CZ" },
    { label: 'Slovakia', checked: false, code: "SK" },
    { label: 'Austria', checked: false, code: "AT" },
    { label: 'Germany', checked: false, code: "DE" },
  ];

  constructor(private modalCtrl: ModalController) {
    this.items = this.getItems();

    const getStoreItems = async () => {
      const { value } = await Preferences.get({
        key: 'jsonData',
      });
      if (value) {
        const selectedItems = JSON.parse(value);
        this.items.forEach((item) => {
          item.checked = selectedItems.some(
            (selectedItem: { label: string }) =>
              selectedItem.label == item.label
          );
        });
      }
    };
    getStoreItems();
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    const selectedItems = this.items.filter((item) => item.checked);

    const saveStoredItems = async () => {
      await Preferences.set({
        key: 'jsonData',
        value: JSON.stringify(selectedItems),
      });
    };
    saveStoredItems();

    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    this.modalCtrl.dismiss(selectedItems, 'location');
  }

  getItems() {
    return [
      { label: 'Czechia', checked: false, code: "CZ" },
      { label: 'Slovakia', checked: false, code: "SK" },
      { label: 'Austria', checked: false, code: "AT" },
      { label: 'Germany', checked: false, code: "DE" },
    ];
  }
}
