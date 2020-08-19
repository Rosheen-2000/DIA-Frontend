import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(
    private message: NzMessageService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  support() {
    this.message.create('success', '感谢点击，我们已经收到您的支持！')
    this.http.get<{ msg: string }>(environment.baseUrl + 'doc/checkstatus/');
  }

}
