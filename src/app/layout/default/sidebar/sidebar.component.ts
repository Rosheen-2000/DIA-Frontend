import {Component, OnInit} from '@angular/core';
import {SpacesService} from './spaces.service';
import {NzModalService} from 'ng-zorro-antd';
import {TemplateModalComponent} from '../../../shared/template-modal/template-modal.component';
import {NewfolderModalComponent} from '../../../shared/newfolder-modal/newfolder-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    public spacesService: SpacesService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.spacesService.getSpaces();
  }

  chooseTemplate() {
    const modal = this.modal.create({
      nzTitle: '从模版新建文档',
      nzContent: TemplateModalComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        // modal: modal
      },
      nzFooter: [
        // {
        //   label: '取消',
        //   onClick: () => {
        //     modal.destroy();
        //   }
        // }
      ]
    });
  }

  newFolder() {
    const modal = this.modal.create({
      nzTitle: '新建文件夹',
      nzContent: NewfolderModalComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        // modal: modal
      },
      nzFooter: [
        // {
        //   label: '取消',
        //   onClick: () => {
        //     modal.destroy();
        //   }
        // }
      ]
    });
  }
}
