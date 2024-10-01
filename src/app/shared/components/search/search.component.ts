import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() foundResult: boolean = true; 
  @Input() found: User[] = [];

  user: User = {
    uid:'',
    firstName:'',
    lastName:'',
    username:'',
    email:'',
    img:'',
    bio:'',
    createdAt:'', 
    imagenUrl:'', 
    imagenPortada:''
  }

  constructor( public modalService: ModalService ) { }

  ngOnInit(): void {
  }

}
