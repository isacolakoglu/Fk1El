import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup | any;
  registerForm: FormGroup | any;
  isLoginMode: boolean = true;
  submitted: boolean = false;
  rememberMeChecked: boolean = false;
  errorMessage: string = '';
  token: any;

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.loginFormClass();
    this.registerFormClass();
    
  }
  loginFormClass() {
    this.loginForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        emailLogin: new FormControl(null, [Validators.required, Validators.email]),
        passwordLogin: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/),
        ]),
      }),
      checkRemember: this.formBuilder.group({
        rememberme: new FormControl(false, [Validators.nullValidator]),
      }),
    });

    this.loginForm.get('rememberme')?.valueChanges.subscribe((value: any) => {
      this.rememberMeChecked = value;
    });
  }
  registerFormClass() {
    this.registerForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        nameRegister: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
        emailRegister: new FormControl(null, [Validators.required, Validators.email]),
        passwordRegister: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]+')]),
      }),
    });
  }

  onLogin() {
    this.submitted = true;
    this.markFormGroupTouched(this.loginForm);
    const formData = this.loginForm.value;
    const email = formData.personalInfo.emailLogin;
    const password = formData.personalInfo.passwordLogin;
    const rememberMe = formData.rememberMe;

    if (this.loginForm.valid) {
      this.authService.loginUser(email, password).subscribe(
        (data: any) => {
          if (this.rememberMeChecked) {
            this.authService.storeToken(data);
          } else {
            this.token = data[0];
            console.log('Sunucudan token gelmediği zaman', this.token);
            localStorage.setItem('Authorization', this.token);
          }
          this.loginForm.reset();
          this.route.navigate(['/']);
        },
        (error: any) => {
          console.log('Giriş başarısız:', error);
        },
      );
    }
  }
  onRegister() {
    this.submitted = true;
    this.markFormGroupTouched(this.registerForm);
    const formData = this.registerForm.value;
    const email = formData.personalInfo.emailRegister;
    const name = formData.personalInfo.nameRegister;
    const password = formData.personalInfo.passwordRegister;

    if (this.registerForm.valid) {
      this.authService.registerUser(email, name, password).subscribe({
        next: (data: any) => {
          console.log('Kayıt Başarılı', data[0]);
          this.token = data[0];
          localStorage.setItem('Authorization', this.token);
          this.registerForm.reset();
          this.route.navigate(['/']);
        },
        error: (error: any) => {
          console.log('Kayıt Başarısız', error);
        },
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  switchTemplate() {
    this.toggleMode();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
    }
  }

  switchButtonClass() {
    let activeButtons;
    var elements = document.querySelectorAll('[name="submitButton"]');
    for (var i = 0; i < elements.length; i++) {
      activeButtons = elements[i].id;
    }
    return activeButtons ? 'active-button' : 'passive-button';
  }
}
