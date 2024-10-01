import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-pages',
  templateUrl: './auth-pages.component.html',
  styleUrls: ['./auth-pages.component.css']
})
export class AuthPagesComponent implements OnInit,OnDestroy {

  public loginForm!: FormGroup;
  public showUserTest: boolean = true;
  public border: boolean = false;
  public isFormEmpty: boolean = true;
  public show: boolean = false;
  public showErrorMessage: boolean = false;
  public email: string = '';
  public alertText: string = '';
  private sub$: Subscription[] = [];
  private closeEvent: any;

  constructor( private authService: AuthService,                    
               private router: Router ) { }

  ngOnDestroy(): void {
    window.removeEventListener( 'click', this.closeEvent );
    this.sub$.forEach( u => u.unsubscribe());    
  }

  ngOnInit(): void {
    this.closeEvent = ( close: MouseEvent ) => {
      const input = document.getElementById('otheropt');
      if( close.target !== input  ){
        this.border = false;
      }
    }

    window.addEventListener('click', this.closeEvent )

    this.loginForm = new FormGroup({
      email: new FormControl( this.email , [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required)
    });

    this.sub$.push(this.authService.errorMessage$.subscribe( errorMessage => {
      this.alertText = errorMessage;  
      this.errorDetected( errorMessage );
    })
    )

  }

  errorDetected( message: string ){
    const time = timer( 6000 );
    this.showErrorMessage = true
    if ( message.trim().length > 0) {      
      this.sub$.push(time.subscribe( () => {
        this.showErrorMessage = false;
      })
      )
      
    }
  }

  login(){

    this.authService.login( this.loginForm.value )
      .subscribe( resp => {                       
        localStorage.setItem('token', resp.token);
        this.router.navigateByUrl('')
        const timer = setTimeout(() => {
          window.location.reload();
          clearTimeout( timer )
        }, 1000);                
      })
    }

  setData( data: string ){
    this.email = data;
    this.loginForm.get('email')?.setValue( this.email );
    const clear = setTimeout(() => {
      this.isFormEmpty = false;
      clearTimeout( clear );
    }, 500);
    

  }

  setBorder( value: boolean ){
    this.border = true;
  }  

  showPass( state: boolean ){
    const input = document.getElementById('inputPass');
    if ( state ) {
      input?.setAttribute('type', 'text');
      this.show = true;
    } else {
      input?.setAttribute('type', 'password');
      this.show = false;
    }
  }

  actionForUserTest(){
    this.showUserTest = false;
  }

}
