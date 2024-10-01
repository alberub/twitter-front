import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { validarQueSeanIguales } from '../../../../core/validators/validator'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  
  private tipo: string = '';
  private sub$: Subscription[] = [];
  public showModal: boolean = false;
  public registerForm = this.fb.group({
    firstName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
    username: new FormControl('', [Validators.required], this.availableValidator() ),
    email: new FormControl('',  [ Validators.required, Validators.email ], this.availableValidator()),
    password: new FormControl('', [Validators.required,  Validators.minLength(1)] ),
    password2: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1)]) )
  },
  { validator: validarQueSeanIguales })  

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router ) {
  }

  get nameControl(): FormControl{
    return this.registerForm.get('firstName') as FormControl;
  }

  get usernameControl(): FormControl{
    return this.registerForm.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get passControl2(): FormControl {
    return this.registerForm.get('password2') as FormControl;
  }

  ngOnInit(): void {

    this.sub$.push(this.emailControl.valueChanges.subscribe( () => {
      this.tipo = 'email';     
      })
    )

    this.sub$.push(this.usernameControl.valueChanges.subscribe( () => {
      this.tipo = 'username';     
      })
    )

  }

  actionForModal(){

    if ( this.showModal === true ) {
      this.showModal = false;
      const body = document.getElementById('body-pd');
      body?.classList.remove('over'); 
    } else {
      this.showModal = true;
      const body = document.getElementById('body-pd');
      body?.classList.add('over'); 
    }

  }

  passwordEquals(): any {

    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ( ( pass1.length > 0 || pass2.length > 0) && ( pass1 !== pass2 ) ) {
      return false;
    } else if( pass1.length > 0 && ( pass1 === pass2 ) ) {
      return true;
    }

  }  

  availableValidator(): AsyncValidatorFn {
    return ( control: AbstractControl ): Observable<ValidationErrors | null > => {
      return this.authService.availableValidator( control.value, this.tipo )
        .pipe(          
          map( (resp: any) => resp.ok === false ? null : { availableValidator: true })
        )
    }
  }

  createUser(){

    const clear = setTimeout(() => {
      this.authService.createUser( this.registerForm.value )      
      .subscribe((_) => {        
        this.actionForModal();
        this.router.navigateByUrl('/auth/login');
        clearTimeout( clear );        
      })  
    }, 1000);
    
  }

}

// ==============================================

// getTrainer().subscribe(trainer =>
//   getStarterPokemon(trainer).subscribe(pokemon =>
//     Do stuff with pokemon
//   )
// );


// getTrainer()
//   .pipe(
//     switchMap(trainer => getStarterPokemon(trainer))
//   )
//   .subscribe(pokemon => {
//     Do stuff with pokemon 
//   });
