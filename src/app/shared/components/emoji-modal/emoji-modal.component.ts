import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-emoji-modal',
  templateUrl: './emoji-modal.component.html',
  styleUrls: ['./emoji-modal.component.css']
})
export class EmojiModalComponent implements OnInit {

  @Input() modalTop: number = 0;
  @Input() textAreaId: string = '';
  @ViewChild('textArea') textArea!: ElementRef;

  constructor( public modalService: ModalService ) { }

  ngOnInit(): void {
  }

  get height(){
    return `${ this.modalTop }px`
  }

  addEmoji( selected: any ){

    const input = this.textArea.nativeElement;
    input.focus();
    const emoji = selected.emoji.native;

    if (document.execCommand) {
      
      var event = new Event('input');
      document.execCommand('insertText', false, emoji );
      return;

    }

    const [ start, end ] = [ input.selectionStart, input.selectionend ];
    input.setRangeText( emoji, start, end, 'end' );
  }

}
