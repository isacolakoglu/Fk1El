import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormControlName,
  FormGroupName,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomValidationService } from '../../services/customValidation/custom-validation.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  loginForm: FormGroup | any;
  registerForm: FormGroup | any;
  submitted: boolean = false;

  // emailFormControl: any;
  rememberMeChecked: boolean = false;

  constructor(public formBuilder: FormBuilder, private customValidationService: CustomValidationService) {}

  ngOnInit() {
    this.loginFormClass();
    this.registerFormClass();
  }
  loginFormClass() {
    this.loginForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        emailLogin: ['', Validators.required],
        passwordLogin: ['', Validators.required],
      }),
      checkRemember: this.formBuilder.group({
        rememberme: [false, Validators.nullValidator],
      }),
    });

    this.loginForm.get('rememberme')?.valueChanges.subscribe((value: any) => {
      this.rememberMeChecked = value;
    });
  }

  onLogin() {
    this.submitted = true;
    const emailControl = this.loginForm.get('personalInfo.emailLogin');
    const passwordControl = this.loginForm.get('personalInfo.passwordLogin');

    if (this.loginForm.invalid) {
      if (emailControl.value === '' && passwordControl.value === '') {
        console.log('Email ve şifre alanları zorunludur.');
        return;
      }

      if (emailControl.value === '') {
        console.log('Email alanı zorunludur.');
        return;
      }

      if (passwordControl.value === '') {
        console.log('Şifre alanı zorunludur.');
        return;
      }
    } else {
      console.log('Başarıyla giriş yapıldı');
      console.table(this.loginForm.value);
    }
  }

  registerFormClass() {
    this.registerForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        nameRegister: ['', Validators.required],
        emailRegister: ['', Validators.required],
        passwordRegister: ['', Validators.required],
      }),
    });
  }

  onRegister() {
    this.submitted = true;
    
    const nameControl = this.registerForm.get('personalInfo.nameRegister');
    const emailControl = this.registerForm.get('personalInfo.emailRegister');
    const passwordControl = this.registerForm.get('personalInfo.passwordRegister');

    if (this.registerForm.invalid) {
      if (nameControl.value === '') {
        console.log('İsim alanı zorunludur.');
        return;
      }
      if (emailControl.value === '') {
        console.log('Email alanı zorunludur.');
        return;
      }
      if (passwordControl.value === '') {
        console.log('Şifre alanı zorunludur.');
        return;
      }
    }

    if (this.registerForm.valid) {
      alert('Kaydedildi.');
      console.table(this.registerForm.value);
      return;
    }
    console.table(this.registerForm.value);
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // Login ve Register tıklandığında butonların stil özellikleri değiştirildi.
  switchButtonClass() {
    let activeButtons;
    var elements = document.querySelectorAll('[name="submitButton"]');
    for (var i = 0; i < elements.length; i++) {
      activeButtons = elements[i].id;
    }
    return activeButtons ? 'active-button' : 'passive-button';
  }
}

/**
 * My Method
 * * Important information is highlighted
 * ! Deprecated method, do not use
 * [class]="switchClassName()
 * // const loginButton = document.getElementById('loginButton');
    // const registerButton = document.getElementById('registerButton');

    // const element = this.elementRef.nativeElement as HTMLElement;
    // this.renderer.addClass(element, 'active-button');

    // if (this.isLoginMode) {
    //   console.log('Login basıldı');
    //   // loginButton?.classList.add('active-button');
    //   // registerButton?.classList.remove('active-button');
    //   console.log('loginButton', loginButton?.className);
    //   console.log('registerButton', registerButton?.className);
    // } else {
    //   console.log('Register basıldı');
    //   console.log('loginButton', loginButton?.className);
    //   console.log('registerButton', registerButton?.className);
    //   // loginButton?.classList.remove('active-button');
    //   // registerButton?.classList.add('active-button');
    // }

        // return this.isLoginMode ? 'active-button' : 'passive-button';
    // return {
    //   'active-button': this.isLoginMode && buttonType === 'submit',
    //   'passive-button': this.isLoginMode || buttonType !== 'submit',
    // };

    // registerForm = new FormGroup({
  //   personalInfo: new FormGroup({
  //     nameRegister: new FormControl(''),
  //     emailRegister: new FormControl(''),
  //     passwordRegister: new FormControl(''),
  //   }),
  // });

  // loginForm = new FormGroup({
  //   personalInfo: new FormGroup({
  //     emailLogin: new FormControl(''),
  //     passwordLogin: new FormControl(''),
  //   }),
  //   checkRemember: new FormGroup({
  //     rememberme: new FormControl(''),
  //   }),
  // });

// get name() {
  //   return this.registerForm.get('name');
  // }

  // get emailRegister() {
  //   return this.registerForm.get('email');
  // }

  // get passwordRegister() {
  //   return this.registerForm.get('password');
  // }

  // get emailLogin() {
  //   return this.loginForm.get('email');
  // }

  // get passwordLogin() {
  //   return this.loginForm.get('password');
  // }

  // handleAuth(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const name = form.value.name;
  //   const email = form.value.email;
  //   const password = form.value.password;

  //   const checker = document.getElementById('myCheckbox');
  //   console.log(checker);

  //   if (this.isLoginMode) {
  //     console.log('Login Mode', email, password);
  //   } else {
  //     console.log('Register Mode', name, email, password);
  //   }
  // }

  
          Validators.pattern('[a-zA-Z0-9]+'),
          Validators.minLength(6),
          Validators.maxLength(20),
  
  // registerFormGroup(){
  //   return new FormGroup({
  //     emailLogin: new FormControl(null, Validators.required, Validators.email),
  //     passwordLogin: new FormControl(null, Validators.required, Validators.pattern('[a-zA-Z0-9]+'), Validators.minLength(6), Validators.maxLength(20)),
  //   })
  // }



  // this.registerForm = this.fb.group({
    //   personalInfo: this.fb.group({
    //     nameRegister: ['', Validators.required],
    //     emailRegister: ['', Validators.required],
    //     passwordRegister: ['', Validators.required],
    //   }),
    // });
    // this.loginForm = this.fb.group({
    //   personalInfo: this.fb.group({
    //     emailLogin: ['', Validators],
    //     passwordLogin: ['', Validators.required],
    //   }),
    //   checkRemember: this.fb.group({
    //     rememberme: ['', Validators.required],
    //   }),
    // });
  

    // loginForm: FormGroup | any;
  // registerForm: FormGroup | any;

  // get registerFormControl() {
  //   return this.registerForm.controls;
  // }



  
  // get emailControl() {
  //   return this.loginForm.get('emailLogin');
  // }

  // get passwordControl() {
  //   return this.loginForm.get('passwordLogin');
  // }

  // this.emailFormControl = this.loginForm.get('personalInfo').get('emailLogin');
  // if (this.loginForm.valid) {
  //   this.loginForm.reset();
  // } else {
  // }

  // validationLogin() {
  //   this.emailFormControl = this.loginForm.get('personalInfo').get('emailLogin');
  //   console.log(this.emailFormControl);
  //   if (this.emailFormControl.value === '') {
  //     this.emailFormControl.setErrors({ required: true });
  //   } else {
  //     return;
  //   }
  // }

  // this.loginForm.markAllAsTouched();

  // if (emailControl?.errors?.required) {
  //   console.log('Email Gerekli');
  // }
  // if (passwordControl?.errors?.required) {
  //   console.log('Şifre gerekli');
  // }

  // get f(): { [key: string]: AbstractControl } {
  //   console.log(this.loginForm.controls.personalInfo);
  //   return this.loginForm.controls.personalInfo;
  // }

  // onReset(): void {
  //   this.submitted = false;
  //   this.loginForm.reset();
  // }

  // Login ve Register butonlarına basıldığında <ng-template> bulunduğu koşula göre kendini gösterir.
  
 */
