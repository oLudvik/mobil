import { PlacesService } from './../../services/places/places.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  allData: any;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.allData = this.placesService.data;
    console.log(this.allData);
  }
}
