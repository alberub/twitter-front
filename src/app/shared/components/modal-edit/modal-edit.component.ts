import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent implements OnInit {

  constructor( public modalService: ModalService ) { }

  @Input() imgTemp: any;

  ngOnInit(): void {
  }

  closeModalEdit(){
    this.modalService.closeModalEdit();
  }

}
