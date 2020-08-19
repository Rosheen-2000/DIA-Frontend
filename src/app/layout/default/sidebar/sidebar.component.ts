import {Component, OnInit} from '@angular/core';
import {SpacesService} from './spaces.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import {NewItemService} from './new-item.service';
import {FreshFolderService} from '../../../core/services/fresh-folder.service';
import {TemplateService} from '../../../shared/template-modal/template.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public loading = false;
  public spaceList: {teamid: string, teamname: string}[] = [];

  // 新建模版
  public title = '';
  public templates: { name: string, id: string }[] = [];
  public templateIndex = 0;

  public createTeamModal = false;
  public teamNameInput = '';
  public modalLoading = false;

  public modalInput = '';
  public modalControls = {
    loading: false,
    addFolder: false,
    addFile: false,
  };

  constructor(
    public spacesService: SpacesService,
    public modal: NzModalService,
    private message: NzMessageService,
    private newItemService: NewItemService,
    private breadService: BreadcrumbService,
    private freshFolderService: FreshFolderService,
    private templateService: TemplateService,
    private router: Router,
    private breadCrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.spacesService.getSpaces().subscribe(
      res => {
        this.spaceList = res.teamlist;
        this.loading = false;
      }
    );
    this.templateService.getAllTemplate().subscribe(
      res => { this.templates = res.templates; }
    );
  }

  chooseTemplate() {
    this.modalControls.addFile = true;
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
    this.modalControls.addFile = false;
  }

  newFolderConfirm() {
    this.modalControls.loading = true;
    this.newItemService.newFolder(this.modalInput, this.breadService.path.foldId, this.breadService.path.spaceId).subscribe(
      res => {
        if (res.msg === 'true') {
          this.modalControls.loading = false;
          this.modalControls.addFolder = false;
          this.message.success('创建成功');
          this.freshFolderService.changemessage('fresh');
        }
        }, error => {
        this.modalControls.loading = false;
        this.message.error('创建失败');
      }
    );
  }

  choose(index: number) {
    this.templateIndex = index;
  }

  addFileConfirm() {
    if (this.title.length === 0) {
      this.message.create('warning', '请设置文档名');
    }
    else {
      this.modalControls.loading = true;
      this.templateService.newDoc(this.title, this.templates[this.templateIndex].id,
        this.breadCrumbService.path.foldId, this.breadCrumbService.path.spaceId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.success('新建成功')
            this.freshFolderService.changemessage('fresh');
            this.modalClose();
          }
        }, error => {
          this.message.error('新建失败');
          this.modalClose();
        }
      );
    }
  }
}
