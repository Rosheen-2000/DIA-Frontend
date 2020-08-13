import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DocService} from './doc.service';
import {ActivatedRoute, Params, Routes} from '@angular/router';
import {Subject, Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { DialogService } from '../../core/services/dialog.service'

declare const tinymce: any;

const provinces = [
  {
    value: 'zhejiang',
    label: 'Zhejiang'
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu'
  }
];

const cities: { [key: string]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {
  zhejiang: [
    {
      value: 'hangzhou',
      label: 'Hangzhou'
    },
    {
      value: 'ningbo',
      label: 'Ningbo',
      isLeaf: true
    }
  ],
  jiangsu: [
    {
      value: 'nanjing',
      label: 'Nanjing'
    }
  ]
};

const scenicspots: { [key: string]: Array<{ value: string; label: string; isLeaf?: boolean }> } = {
  hangzhou: [
    {
      value: 'xihu',
      label: 'West Lake',
      isLeaf: true
    }
  ],
  nanjing: [
    {
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
      isLeaf: true
    }
  ]
};

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {

  docId: string;

  values: string[] | null = null;

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
      this.docService.getDocument(this.docId).subscribe(
        res => {
          tinymce.activeEditor.setContent(res.Content);
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

      init_instance_callback(editor) {
        // 根据权限可以关闭文档的编辑权限
        tinymce.activeEditor.setMode('readonly');
        tinymce.activeEditor.setMode('design');
      },

      setup: function(editor) {
        editor.on('keyup', function(e) {
          console.log('KeyUp! But nothing happened...');
          localStorage.setItem('modify', 'true');
        });
      }
    });


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
    localStorage.removeItem('modify');
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
          localStorage.removeItem('modify');
          this.message.create('success', '保存成功');
        }
        else {
          this.message.create('error', '保存失败，请稍后重试');
        }
      },
      error => {
        this.message.create('error', '奇怪的错误增加了，请稍后重试');
      }
    );
  }

  onChanges(values: string[]): void {
    console.log(values);
  }

  /** load data async execute by `nzLoadData` method */
  loadData(node: NzCascaderOption, index: number): PromiseLike<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (index < 0) {
          // if index less than 0 it is root node
          node.children = provinces;
        } else if (index === 0) {
          node.children = cities[node.value];
        } else {
          node.children = scenicspots[node.value];
        }
        resolve();
      }, 1000);
    });
  }
}

