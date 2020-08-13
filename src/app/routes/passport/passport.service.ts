import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class PassportService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    // private jwtHelperService: JwtHelperService,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  public checkUsernameValid(uname: string): Observable<{ res: string }> {
    const form = new FormData();
    form.set('uname', uname);
    return this.http.post<{
      res: string
    }>(this.baseUrl + 'passport/check/', form);
  }

  public login(uname: string, pwd: string): Observable<{ msg: string, token: string }> {
    const form = new FormData();
    form.set('uname', uname);
    form.set('pwd', pwd);
    return this.http.post<{
      msg: string, token: string
    }>(this.baseUrl + 'passport/login/', form);
  }

  public logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
  }

  public register(uname: string, pwd: string): Observable<{ msg: string, token: string }> {
    const form = new FormData();
    form.set('uname', uname);
    form.set('pwd', pwd);
    return this.http.post<{
      msg: string, token: string
    }>(this.baseUrl + 'passport/register/', form);
  }

  // 暂不从token中获取数据
  // public decodeUserFromToken(token): any {
  //   return this.jwtHelperService.decodeToken(token);
  // }

}
