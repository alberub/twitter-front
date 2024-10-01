import { FormGroup, ValidationErrors } from '@angular/forms';

export function validarQueSeanIguales(control: FormGroup): ValidationErrors | null {
    const password = control.get('password')!;
    const confirmarPassword = control.get('password2')!;

    return password.value === confirmarPassword.value ? null : { 'noSonIguales': true };
}