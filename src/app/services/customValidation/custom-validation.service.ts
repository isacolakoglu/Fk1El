import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  constructor() {}

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Geçerli olmayan değer için hata döndürme
      }

      const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true }; // Hatalı şifre durumu
    };
  }

  nameValidator(UserList: string[]) {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (UserList.includes(control.value)) {
            resolve({ userNameNotAvailable: true }); // Kullanıcı adının kullanılamaması durumu
          } else {
            resolve(null);
          }
        }, 1000); // 1 saniyelik gecikme ekleyerek örnek bir asenkron işlem simüle ediliyor
      });
    };
  }
}
