import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastMessage',
  // pure: false
})
export class LastMessagePipe implements PipeTransform {

  transform( messages: any[] ): any {
    return messages[messages.length-1].message;    
  }

}
