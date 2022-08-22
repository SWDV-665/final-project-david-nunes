import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  zipForm: FormGroup;
  forecastArray: any;
  queryData: any;
  userLocation: string;
  dataResolved: boolean;
  myBaseKey: string = "https://api.weatherapi.com/v1/forecast.json?key=05ac3dec97764efbbd7214254222108&q="
  forecastQuery: string = "&days=5&aqi=no&alerts=no"

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder,private geoLocation: Geolocation) {
    this.zipForm = this.formBuilder.group({
      zipcode: [''],
    });
    this.dataResolved = false;
  }

  //Uses geo-locator to set the latitude and longitude
  public locateMe(){
    this.geoLocation.getCurrentPosition()
      .then((res) =>{
        let lat = res.coords.latitude.toString();
        let long = res.coords.longitude.toString();
        this.userLocation = lat + "," + long;
        this.handleRequests()
      })
  }

  //Handles when the form is submitted. Sets the location to the zipcode.
  async onSubmit(form: any){
    this.userLocation = form.zipcode;
    this.handleRequests()
  }

  //Handles api request, uses either lat/long or zipcode.
  //Parses through the json response to get week-long forecast
  private handleRequests(){
    fetch(this.myBaseKey + this.userLocation + this.forecastQuery)
      .then((res) => res.json())
      .then((data) => {
        this.queryData = data.forecast.forecastday;
        this.forecastArray = []
        for (let i of this.queryData){
          let x = {
            day: this.handleWeekDay(i.date),
            high: i.day.maxtemp_f,
            low: i.day.mintemp_f,
            avgTemp: i.day.avgtemp_f,
            conditions: {
              name: i.day.condition.text,
              icon: i.day.condition.icon
            }
          }
          this.forecastArray.push(x);
        }
        this.dataResolved = true;
      })
  }

  //Converts the Date to a week day for the card title, checks if date is today.
  private handleWeekDay(date: string){
    let today = new Date()
    let x = new Date(date);
    if(today.setHours(0,0,0,0) == x.setHours(0,0,0,0)){
      return "Today"
    }
    let day = x.getDay();
    switch (day){
      case 0: return "Sunday";
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
    }
  }


}
