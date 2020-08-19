import {Component, OnDestroy, OnInit, HostListener, NgZone, ViewChild} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocService} from './doc.service';
import {ActivatedRoute, Params, Router, Routes} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzCascaderOption} from 'ng-zorro-antd/cascader';
import {DialogService} from '../../core/services/dialog.service';
import { addDays, formatDistance } from 'date-fns';
import { DocItemService } from '../../shared/doc-item/doc-item.service';
import {SharingModalComponent} from "../../shared/sharing-modal/sharing-modal.component";
import { StorageService } from '../../core/services/storage.service';
import { PowerBoardService } from './power-board/power-board.service';
import { environment } from '../../../environments/environment'

declare const tinymce: any;
declare const window: any;

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {

  @HostListener('window:unload', [`$event`])
  private handleUnload() {
    if (this.tag !== undefined) {
      const form = new FormData();
      form.set('tag', this.tag.toString());
      navigator.sendBeacon(environment.baseUrl + 'doc/directquit/', form);
    }
  }

  docId: string;
  public isTeamDoc = false;

  // 收藏切换按钮
  public switchLoading = false;
  public isFavored = false;

  nzBelongOptions: any[] | null = null;
  values: any[] | null = null;

  private timer;

  // 评论区drawer的变量和函数
  visible = false;

  // 分享
  sharingVisible = false;
  @ViewChild('shareModal') shareModal: SharingModalComponent;

  sharingCancel(): void {
    this.sharingVisible = false;
  }

  sharingOk(): void {
    this.sharingVisible = false;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  // * 防抖 保存文本内容
  updateResult$ = new Observable<{ msg: string }>();
  private updateContent$ = new Subject<string>();

  public modified_mark: boolean = false;

  // * 文档锁相关
  private can_edit: boolean = false;
  private get_status_timer: any;
  private maintain_lock_timer: any;

  public current_lock_status: boolean;
  // undifined: 无锁    true: 持有锁    false: 其他用户持有锁
  private tag: number;  // 用于保持锁
  public once_blocked: boolean = false;

  constructor(
    private docService: DocService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    public dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private storage: StorageService,
    private powerservice: PowerBoardService,
  ) {
  }

  ngOnInit(): void {
    window.MyEditor = {component: this};

    this.route.params.subscribe((params: Params) => {
      this.docId = params.id;
      console.log(this.docId);
    });

    this.initEditor();
    console.log('拿到id'+this.docId);

    // 启动查询锁状体的计时器
    this.powerservice.getPower(this.docId).subscribe(
      res => {
        if (res.userPower > 1) {
          this.can_edit = true;
          console.log('开始计时');
          
          this.get_status_timer = setInterval(() => {
            this.getLockStatus();
          }, 5000)
        }
      }
    );

    // 自动保存
    this.activateAutoSave();

  }

  ngOnDestroy() {
    tinymce.remove();
    window.MyEditor = null;
    clearInterval(this.get_status_timer);
    clearInterval(this.maintain_lock_timer);
  }

  initEditor() {
    // tinyMCE配置
    tinymce.init({
      base_url: '/tinymce/',
      suffix: '.min',
      selector: 'textarea#tiny',
      apiKey: 'pzsbp1xb6j13dd4aduwebi7815hzj1upr7v42ojpcbc8c7pu',

      height: 800,
      statusbar: false,
      toolbar_sticky: true,
      theme: 'silver',
      plugins: 'image imagetools quickbars codesample table autolink checklist',
      toolbar1: 'undo redo | save | formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | quickimage codesample table ',
      codesample_languages: [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' }
      ],

      init_instance_callback(editor) {
        console.log('editor initialized');
        window.MyEditor.component.initData();
      },
      setup: function(editor) {
        editor.on('keyup', function(e) {
          console.log('KeyUp! But nothing happened...');
          window.MyEditor.component.autoSave();
        });
        editor.on('focus', function(e) {
          console.log('focus');
          window.MyEditor.component.onFocusEditor();
        });
        editor.on('blur', function(e) {
          console.log('blur');
        });
      }
    });
  }

  initData() {
    this.docService.getDocument(this.docId).subscribe(
      res => {
        console.log(res);
        this.isFavored = res.starred;
        this.switchLoading = false;
        tinymce.activeEditor.setContent(res.Content);
        this.isTeamDoc = res.isTeamDoc;
      }
    );
  }

  activateAutoSave() {
    this.updateResult$ = this.updateContent$.pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      switchMap( text => {
        this.modified_mark = false;
        return this.docService.modifyContent(this.docId, text);
      }),
    );
    this.updateResult$.subscribe(
      res => {
        if (res.msg === 'true') {
          console.log('自动保存成功');
        }
        else {
          console.log('自动保存失败');
        }
      },
      error => {
        console.log('自动保存时发生了奇怪的错误');
      }
    );
  }

  getLockStatus(): void {
    console.log('get lock status');
    this.docService.checkLockStatus(this.docId).subscribe(
      res => {
        if (res.msg === 'true') {
          switch(res.status) {
            case 0:
              this.current_lock_status = undefined;
              console.log('文件无锁');
              // TODO 设置编辑器允许编辑
              break;
            case 1:
              if (res.username === this.storage.get('username')) {
                this.current_lock_status = true;
                console.log('持有锁');
                // TODO 设置编辑器允许编辑
              }
              else {
                this.current_lock_status = false;
                this.once_blocked = true;
                console.log('其他用户持有锁');
                // TODO 设置编辑器不可编辑
              }
              break;
            default:
              console.log('返回信息有误');
          }
        }
        else {
          console.log(res.msg);
          console.log(res.status);
          console.log(res.username);
          console.log('查询出错');
        }
      }
    )
  }

  onFocusEditor() {
    if (this.can_edit && this.current_lock_status===undefined) {
      // 文件无锁，可以申请锁
      this.docService.askForEditLock(this.docId).subscribe(
        res => {
          if (res.msg === 'true') {
            // 成功获得锁
            this.current_lock_status = true;
            this.tag = res.tag;
            console.log('成功取得锁');
            this.maintain_lock_timer = setInterval(() => {
              this.maintainLock();
            }, 2000)
          }
          else {
            // 取得锁失败
            this.message.create('warning', '获得文件锁失败，您的编辑内容将无法保存')
            console.log('获取锁失败');
          }
        },
        error => {
          this.message.create('error', '奇怪的错误增加了');
          this.message.create('warning', '获得文件锁失败，您的编辑内容将无法保存');
        }
      )
    }
  }

  private maintainLock() {
    this.docService.maintainEditLock(this.tag).subscribe(
      res => {
        if (res.msg === 'true') {
          console.log('锁更新成功');
        }
        else {
          console.log('锁更新失败');
        }
      }
    )
  }

  clickSave(): void {
    console.log(tinymce.activeEditor.getContent());
    this.docService.modifyContent(this.docId, tinymce.activeEditor.getContent()).subscribe(
      res => {
        if (res.msg === 'true') {
          this.message.create('success', '保存成功');
        } else {
          this.message.create('error', '保存失败，请稍后重试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后重试');
      }
    );
  }

  clickBack(): void {
    // history.go(-1);
    this.router.navigate(['/dashboard/own']);
  }

  clickSwitch(): void {
    this.switchLoading = true;
    console.log('switch' + this.isFavored);
    if (this.isFavored) {
      console.log(this.isFavored);
      this.docService.favorDoc(this.docId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.create('success', '成功加入收藏');
          }
          else {
            this.message.create('error', '操作失败，请稍后再试');
          }
          this.switchLoading = false;
        }
      );
    }
    else {
      this.docService.unFavorDoc(this.docId).subscribe(
        res => {
          console.log(res);
          if (res.msg === 'true') {
            this.message.create('success', '成功取消收藏');
          }
          else {
            this.message.create('error', '操作失败，请稍后再试');
          }
          this.switchLoading = false;
        }
      );
    }
  }

  onChanges(values: any): void {
    console.log(values, this.values);
  }

  autoSave() {
    this.modified_mark = true;
    // 仅在取得锁的情况下启动自动保存
    if (this.current_lock_status && !this.once_blocked) {
      this.updateContent$.next(tinymce.activeEditor.getContent());
    }
  }

  share() {
    this.sharingVisible = true;
    this.shareModal.ngOnInit();
  }
}

