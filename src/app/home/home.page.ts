import { PlacesService } from './../services/places/places.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WeatherModalComponent } from './weather-modal/weather-modal.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  countriesDataArray: any[] = [];

  constructor(
    public modalCtrl: ModalController,
    public http: HttpClient,
    private placesService: PlacesService
  ) {

    const getCountriesData = async () => {
      const { value } = await Preferences.get({
        key:"homeFetchData"
      })

      if(value) {
        this.countriesDataArray = JSON.parse(value)
        
      }
    }
    getCountriesData()
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: WeatherModalComponent,
    });

    await modal.present();
    const { data: newData, role } = await modal.onWillDismiss();

    if (role == 'location') {
      const toFetch = newData.map((data: any) => {
        return ({
          code: data.code, 
          label: data.label
        })
      });
      this.fetchData(toFetch);
    }
  }

  sendData(data: any) {
    this.placesService.data = data;
  }

  async fetchData(countries: any) {
    console.log('hh', countries)
    this.countriesDataArray = [];
    countries.forEach((country: any) => {
      //const URL = `https://restcountries.com/v3.1/name/${country}`;
      const URL = `https://date.nager.at/api/v3/publicholidays/2024/${country.code}`;
      this.http.get(URL).subscribe((data) => {
        this.countriesDataArray.push({data, code: country.code, label: country.label});
        console.log(data)
        const saveStoredItems = async () => {
          await Preferences.set({
            key: 'homeFetchData',
            value: JSON.stringify(this.countriesDataArray),
          });
        };
        saveStoredItems();
      });
    });
    console.log(this.countriesDataArray);
    console.log('load data from api', countries);
  }
}
