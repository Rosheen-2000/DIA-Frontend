import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PassportService} from '../passport.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service'
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public pwd_consist: boolean;
  public uname_valid: boolean;

  private checkResult$ = new Observable<{ res: string }>();
  private checkContent$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private passwordService: PassportService,
    private message: NzMessageService,
    private router: Router,
    private storage: StorageService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: '',
      password: '',
      pwd_confirm: ''
    });
    this.checkResult$ = this.checkContent$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap( text => 
        this.passwordService.checkUsernameValid(text)
      ),
    );
    this.checkResult$.subscribe(
      (res) => {
        if (res.res === 'true') {
          this.uname_valid = true;
        }
        else {
          this.uname_valid = false;
        }
      }
    );
  }

  onSubmit(): void {
    console.log(this.form.value);
    this.passwordService.register(this.form.value.username, this.form.value.password).subscribe(
      (res) => {
        if (res.msg === 'true') {
          console.log(res.token);
          this.storage.set('token', res.token);
          this.message.create('success', "欢迎，"+this.form.value.username);
          this.router.navigateByUrl("");
        }
        else {
          console.log('fail');
          this.message.create('error', "注册失败，请稍后重试");
          this.form.value.password = "";
          this.form.value.pwd_confirm = "";
        }
      },
      error => {
        console.log('fail');
        this.message.create('error', "发生错误，请稍后重试");
        this.form.value.password = "";
        this.form.value.pwd_confirm = "";
      }
    );
  }

  checkUnameValid(): void {
    const text = this.form.value.username;
    if (text==='') {
      this.uname_valid = undefined;
    }
    else {
      this.checkContent$.next(text);
    }
  }

  checkPwdConsist(event: any): void {
    if (this.form.value.password === this.form.value.pwd_confirm && this.form.value.password !== "") {
      this.pwd_consist = true;
    }
    else {
      this.pwd_consist = false;
    }
  }

}
