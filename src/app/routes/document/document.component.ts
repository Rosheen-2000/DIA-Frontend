import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocService} from './doc.service';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzCascaderOption} from 'ng-zorro-antd/cascader';
import {DialogService} from '../../core/services/dialog.service'

declare const tinymce: any;

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

const PerSonalPowerOptions = [
  {
    value: 'self',
    label: '我',
    children: [
      {
        value: 'readonly',
        label: '可读',
        isLeaf: true
      },
      {
        value: 'readwrite',
        label: '读写',
        isLeaf: true
      },
    ]
  },
  {
    value: 'others',
    label: '其它人',
    children: [
      {
        value: 'readonly',
        label: '可读',
        isLeaf: true
      },
      {
        value: 'readwrite',
        label: '读写',
        isLeaf: true
      },
    ]
  }
];

const TeamPowerOptions = [
  {
    value: '1',
    label: '成员1',
    children: [
      {
        value: 'readonly',
        label: '可读',
        isLeaf: true
      },
      {
        value: 'readwrite',
        label: '读写',
        isLeaf: true
      },
    ]
  },
  {
    value: '2',
    label: '成员2',
    children: [
      {
        value: 'readonly',
        label: '可读',
        isLeaf: true
      },
      {
        value: 'readwrite',
        label: '读写',
        isLeaf: true
      },
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

  nzBelongOptions: any[] | null = null;
  values: any[] | null = null;

  private timer;

  // 防抖 保存文本内容
  // updateResult = new Observable<{ msg: string }>();
  // private updateContent = new Subject<string>();

  constructor(
    private docService: DocService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    public dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.docId = params.id;
      console.log(this.docId);
      this.docService.getDocument(this.docId).subscribe(
        res => {
          console.log(res);
          this.timer = setInterval(() => {
            console.log('time');
            if (tinymce.activeEditor) {
              tinymce.activeEditor.setContent(res.Content);
              tinymce.activeEditor.setMode('readonly');
              tinymce.activeEditor.setMode('design');
              clearInterval(this.timer);
            }
          }, 500);
        }
      );
    });
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
      toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
      image_advtab: true,
    });

    //cascader的init
    setTimeout(() => {
      this.nzBelongOptions = belongOptions;
    }, 100);


    // 防抖 保存文本内容
    // this.updateResult = this.updateContent.pipe(
    //   debounceTime(5000),
    //   distinctUntilChanged(),
    //   switchMap(
    //     newcontent => this.docService.modifyContent(this.docId, newcontent)
    //   )
    // );
  }

  ngOnDestroy() {
    // localStorage.removeItem('modify');
    tinymce.remove();
  }

  testKeyUp(event: any): void {
    console.log(event);
    alert('111');
  }

  // * tinymce监听keyup有困难，不提供实时保存
  // saveContent(): void {
  //   this.updateContent.next(this.form.value.Content);
  //   this.updateResult.subscribe(
  //     res => {
  //       if (res.msg === 'true') {
  //         this.message.create('success', '自动保存成功');
  //       }
  //     }
  //   )
  // }

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
    history.go(-1);
  }

  onChanges(values: any): void {
    console.log(values, this.values);
  }
}

