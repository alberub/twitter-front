import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css']
})
export class BackComponent implements OnInit {

  constructor( private location: Location ) { }

  ngOnInit(): void {
  }

  backComponent(){
    this.location.back();
  }

}
