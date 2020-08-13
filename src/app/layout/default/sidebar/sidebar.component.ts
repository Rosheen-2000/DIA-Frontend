import {Component, OnInit} from '@angular/core';
import {SpacesService} from './spaces.service';
import {NzModalService} from 'ng-zorro-antd';
import {TemplateModalComponent} from '../../../shared/template-modal/template-modal.component';

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
      // nzViewContainerRef: this.viewContainerRef,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        // title: 'title in component',
        // subtitle: 'component sub title，will be changed after 2 sec'
      },
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: '取消',
          onClick: () => {
            modal.destroy();
          }
        }
      ]
    });
  }
}
