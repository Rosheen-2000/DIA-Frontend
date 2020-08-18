import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentComponent } from '../../routes/document/document.component'

@Injectable({
  providedIn: 'root'
})
export class UnsaveGuard implements CanDeactivate<unknown> {
  canDeactivate(component: DocumentComponent) {
    return (component.modified_mark)? component.dialogService.confirm('有未保存的内容，仍要离开？'): true;
    // return component.dialogService.confirm('Discard changes?');
  }
  
}
