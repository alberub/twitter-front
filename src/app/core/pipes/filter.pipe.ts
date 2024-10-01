import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@core/models/usuario.model';
import { UserService } from '@shared/services/user.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  private user: User;
  private find!: any;

  constructor( private userService: UserService ){
    this.user = userService.user;
  }

  transform( members: any[] ): any {

    members.forEach( (element): any => {
      if ( element._id === this.user.uid ) {
        const f = members.indexOf( element );
        members.splice( f, 1 );
        
        return members;
      }
    })
  }

}
