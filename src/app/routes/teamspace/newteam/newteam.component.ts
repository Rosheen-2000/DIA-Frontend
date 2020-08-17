import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TeamService } from '../team.service'

@Component({
  selector: 'app-newteam',
  templateUrl: './newteam.component.html',
  styleUrls: ['./newteam.component.scss']
})
export class NewteamComponent implements OnInit {

  validateForm!: FormGroup;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  selectedValue = null;
  listOfOption: Array<{ uid: string, uname: string, avatar: string }> = [];
  nzFilterOption = () => true;

  constructor(
    private fb: FormBuilder,
    private teamservice: TeamService,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.addField();
  }

  search(value: string): void {
    // this.teamservice.getUserByName(value).subscribe(
    //   res => {
    //     this.listOfOption = [
    //       {
    //         uid: res.userid,
    //         uname: res.username,
    //         avatar: res.avatar
    //       }
    //     ]
    //   }
    // )
    // ! DEGUG用
    console.log('onsearch');
    this.listOfOption = [
      {
        uid: '110',
        uname: 'testname',
        avatar: 'avatar'
      }
    ]
    // this.httpClient
    //   .jsonp<{ result: Array<[string, string]> }>(`https://suggest.taobao.com/sug?code=utf-8&q=${value}`, 'callback')
    //   .subscribe(data => {
    //     const listOfOption: Array<{ value: string; text: string }> = [];
    //     data.result.forEach(item => {
    //       listOfOption.push({
    //         value: item[0],
    //         text: item[0]
    //       });
    //     });
    //     this.listOfOption = listOfOption;
    //   });
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(this.listOfControl[index - 1].controlInstance, new FormControl(null, Validators.required));
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value);
  }

}
