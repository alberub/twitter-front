import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NewsService } from '@shared/services/news.service';

@Component({
  selector: 'app-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.css']
})
export class ListsPageComponent implements OnInit {

  constructor( public newService: NewsService, private location: Location ) { }

  ngOnInit(): void {
  }

  back(){
    this.location.back();
  }

}
