import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('token')===null) {
      this.router.navigateByUrl("passport/login");
    }
  }

}
