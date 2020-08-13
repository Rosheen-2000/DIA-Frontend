import { Component, OnInit } from '@angular/core';
import { DocService } from '../../routes/document/doc.service'
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit {

  public title: string = '';
  public templateid: string = '';

  constructor(
    private docservice: DocService,
    private router: Router,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
  }

  newDoc(): void {
    this.docservice.newDocument(this.title, this.templateid).subscribe(
      (res) => {
        if (res.msg === 'true') {
          this.router.navigateByUrl("docs/:"+res.docid);
        }
        else {
          this.message.create('error', "奇怪的错误增加了，请稍后再试");
        }
      },
      error => {
        this.message.create('error', "奇怪的错误增加了，请稍后再试");
      }
    )
  }

}
