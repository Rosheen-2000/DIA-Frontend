import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentComponent } from '../../routes/document/document.component'

@Injectable({
  providedIn: 'root'
})
export class UnsaveGuard implements CanDeactivate<unknown> {
  canDeactivate(component: DocumentComponent) {
    return (localStorage.getItem('modify')==='true')? component.dialogService.confirm('Discard changes?'): true;
    // return component.dialogService.confirm('Discard changes?');
  }
  
}
