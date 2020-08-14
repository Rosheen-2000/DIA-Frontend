import { Injectable } from '@angular/core';
import { StorageService } from '../../core/services/storage.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService;
  ) { }

  public getAuthorizationToken(): string {
    return this.storage.get('token');
  }
}
