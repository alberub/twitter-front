import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private http: HttpClient ) { }

  uploadImages( tipo:"users"|"usersP"|"tweets", archivo: File, id: string ){    
    const formData =  new FormData();
    formData.append('imagen', archivo);
    return this.http.put<{ ok: boolean, msg: string, nombreArchivo: string }>( `${ url }/upload/${ tipo }/${ id }`, formData );
  }
}
