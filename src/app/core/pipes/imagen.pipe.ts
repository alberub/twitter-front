import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo:'tweets'|'users'): string | any {
    
    if( !img ){
      return `${ url }/upload/users/no-img`
    } else if( img ){
      // return `${ url }/upload/${ tipo }/${ img }`;
      return img;
    }

  }

}
