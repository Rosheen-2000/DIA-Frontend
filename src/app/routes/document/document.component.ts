import {Component, OnDestroy, OnInit, HostListener, NgZone} from '@angular/core';
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

declare const tinymce: any;
declare const window: any;

const belongOptions = [
  {
    value: 'personal',
    label: '个人',
    isLeaf: true
  },
  {
    value: 'team',
    label: '团队',
    children: [
      {
        value: '1',
        label: '团队1',
        isLeaf: true
      },
      {
        value: '2',
        label: '团队2',
        isLeaf: true
      },
      {
        value: '3',
        label: '团队3',
        isLeaf: true
      }
    ]
  }
];


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {

  docId: string;
  switchLoading: boolean = false;
  // TODO 添加获取收藏信息的方法
  public isFavored: boolean = false;

  nzBelongOptions: any[] | null = null;
  values: any[] | null = null;

  private timer;

  // 评论区drawer的变量和函数
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  // 防抖 保存文本内容
  // updateResult = new Observable<{ msg: string }>();
  // private updateContent = new Subject<string>();

  constructor(
    private docService: DocService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    public dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router,
    private docitemservice: DocItemService,
  ) {
  }

  ngOnInit(): void {
    window.MyEditor = {component: this};

    this.route.params.subscribe((params: Params) => {
      this.docId = params.id;
      console.log(this.docId);
    });

    this.initEditor();
  }

  ngOnDestroy() {
    tinymce.remove();
    window.MyEditor = null;
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
      plugins: 'save tinycomments image',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author',
      toolbar1: 'image save | formatselect || bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      toolbar2: 'image',
      image_advtab: true,

      init_instance_callback(editor) {
        console.log('editor initialized');
        window.MyEditor.component.initData();
      }
    });
  }

  initData() {
    console.log('fetch data');
    this.docService.getDocument(this.docId).subscribe(
      res => {
        console.log(res);
        console.log('set data');
        tinymce.activeEditor.setContent(res.Content);
      }
    );
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
    if (!this.switchLoading) {
      this.switchLoading = true;
      if (!this.isFavored) {
        this.docitemservice.favorDoc(this.docId).subscribe(
          res => {
            if (res.msg === 'true') {
              this.isFavored = !this.isFavored;
              this.message.create('success', '成功加入收藏');
            }
            else {
              this.message.create('error', '操作失败，请稍后再试');
            }
            this.switchLoading = false;
          }
        )
      }
      else {
        this.docitemservice.unfavorDoc(this.docId).subscribe(
          res => {
            if (res.msg === 'true') {
              this.isFavored = !this.isFavored;
              this.message.create('success', '成功取消收藏');
            }
            else {
              this.message.create('error', '操作失败，请稍后再试');
            }
            this.switchLoading = false;
          }
        )
      }
    }
  }

  onChanges(values: any): void {
    console.log(values, this.values);
  }
}

