import {
  Component,
  OnInit,
  NgModule,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;

  constructor() {}

  ngOnInit() {}

  // Login ve Register butonlarına basıldığında <ng-template> bulunduğu koşula göre kendini gösterir.
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

  
  handleAuth(form: NgForm) {
    if(!form.valid){
      return
    }
    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      console.log('Login Mode', email, password);
    } else {
      console.log('Register Mode', name, email, password);
    }
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
 */
