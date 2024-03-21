import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fb: FormBuilder) {}

  // createLoginForm(): FormGroup {
  //   return this.fb.group({
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)], Validators.maxLength(20)],
  //   });
  // }

  // createRegisterForm(): FormGroup {
  //   return this.fb.group(
  //     {
  //       name: ['', Validators.required],
  //       email: ['', [Validators.required, Validators.email]],
  //       password: ['', [Validators.required, Validators.minLength(6)], Validators.maxLength(20)],
  //     },
  //     {
  //       validator: this.passwordMatchValidator,
  //     },
  //   );
  // }

  // private passwordMatchValidator(form: FormGroup) {}
}
