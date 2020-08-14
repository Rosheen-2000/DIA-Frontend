import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { StorageService } from '../../core/services/storage.service'

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  ngOnInit(): void {
    if (this.storage.get('token')===null) {
      this.router.navigateByUrl("passport/login");
    }
  }

}
