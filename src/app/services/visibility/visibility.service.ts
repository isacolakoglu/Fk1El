import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityService {

  showNavigation$: BehaviorSubject<boolean>
  showHeader$: BehaviorSubject<boolean>

  constructor() {
    this.showNavigation$ = new BehaviorSubject<boolean>(true)
    this.showHeader$ = new BehaviorSubject<boolean>(true)
   }
}
