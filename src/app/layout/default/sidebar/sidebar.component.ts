import {Component, OnInit} from '@angular/core';
import {SpacesService} from './spaces.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TemplateModalComponent} from '../../../shared/template-modal/template-modal.component';
import {NewfolderModalComponent} from '../../../shared/newfolder-modal/newfolder-modal.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public spaceList: {teamid: string, teamname: string}[] = [];

  public createTeamModal = false;
  public teamNameInput = '';
  public modalLoading = false;

  constructor(
    public spacesService: SpacesService,
    public modal: NzModalService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.spaceList = [{teamname: 'test', teamid: '11'}];
    this.spacesService.getSpaces().subscribe(
      res => {
        console.log(res);
        this.spaceList = res.teamlist;
      }
    );
  }

  chooseTemplate() {
    const modal = this.modal.create({
      nzTitle: '从模版新建文档',
      nzContent: TemplateModalComponent,
      nzGetContainer: () => document.body,
      nzComponentParams: {
        // modal: modal
      },
    });
  }

  newTeam(): void {
    this.createTeamModal = true;
    this.teamNameInput = '';
  }

  newTeamCancel(): void {
    this.createTeamModal = false;
  }

  newTeamConfirm(): void {
    this.modalLoading = true;
    this.spacesService.createTeam(this.teamNameInput).subscribe(
      res => {
        console.log(res);
        this.initData();
        this.modalLoading = false;
        this.createTeamModal = false;
        this.message.create('success', '新建成功');
      }, error => {
        this.modalLoading = false;
        this.createTeamModal = false;
        this.message.create('error', '新建失败');
      }
    );

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
