import {Component, OnInit} from '@angular/core';
import {SpacesService} from './spaces.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TemplateModalComponent} from '../../../shared/template-modal/template-modal.component';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {NewItemService} from './new-item.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public loading = false;
  public spaceList: {teamid: string, teamname: string}[] = [];

  public createTeamModal = false;
  public teamNameInput = '';
  public modalLoading = false;

  public modalInput = '';
  public modalControls = {
    loading: false,
    addFolder: false
  };

  constructor(
    public spacesService: SpacesService,
    public modal: NzModalService,
    private message: NzMessageService,
    private newItemService: NewItemService,
    private breadService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    this.loading = true;
    this.spacesService.getSpaces().subscribe(
      res => {
        this.spaceList = res.teamlist;
        this.loading = false;
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
      nzFooter: [],
    });
  }

  newTeam(): void {
    this.createTeamModal = true;
    this.teamNameInput = '';
  }

  newTeamCancel(): void {
    this.createTeamModal = false;
    this.modalLoading = false;
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
      },
      error => {
        this.modalLoading = false;
        this.createTeamModal = false;
        this.message.create('error', '新建失败');
      }
    );
  }

  newFolder(): void {
    this.modalControls.addFolder = true;
  }

  modalClose() {
    this.modalControls.loading = false;
    this.modalControls.addFolder = false;
  }

  newFolderConfirm() {
    this.modalControls.loading = true;
    this.newItemService.newFolder(this.modalInput, this.breadService.path.foldId, this.breadService.path.spaceId).subscribe(
      res => {
        if (res.msg === 'true') {
          this.modalControls.loading = false;
          this.modalControls.addFolder = false;
          this.message.success('创建成功');
        }
        }, error => {
        this.modalControls.loading = false;
        this.message.error('创建失败');
      }
    );
  }
}
