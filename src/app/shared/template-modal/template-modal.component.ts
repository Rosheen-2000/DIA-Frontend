import {Component, Input, OnInit} from '@angular/core';
import {DocService} from '../../routes/document/doc.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {error} from '@angular/compiler/src/util';
import {TemplateService} from './template.service';
import {NzModalService} from 'ng-zorro-antd';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit {
  public title = '';
  public templateIndex = 0;
  public templates: { name: string, id: string }[] = [];

  constructor(
    private docservice: DocService,
    private router: Router,
    private message: NzMessageService,
    private templateService: TemplateService,
    private modal: NzModalService,
    private breadCrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    this.templateService.getAllTemplate().subscribe(
      res => { console.log(res); this.templates = res.templates; }
    );
  }

  chooseTemplate(i: number): void{
    this.templateIndex = i;
    console.log(this.templateIndex);
  }

  create(): void {
    if (this.title.length === 0) {
      this.message.create('warning', '请设置文档名');
    }
    else {
      console.log(this.breadCrumbService.path);
      this.templateService.newDoc(this.title, this.templates[this.templateIndex].id,
        this.breadCrumbService.path.foldId, this.breadCrumbService.path.spaceId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.router.navigate(['/docs/' + res.docid]).then();
            this.modal.closeAll();
          }
        }
      );
    }
  }
}
