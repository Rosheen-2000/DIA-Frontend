import { Component, OnInit, Input } from '@angular/core';
import { addDays, formatDistance } from 'date-fns';
import { CommentService } from './comment.service'
import { NzMessageService } from 'ng-zorro-antd/message';
import { DocComment } from './doccomment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() docid: string;

  // 评论区drawer的变量和函数
  visible = false;

  constructor(
    private commentservice: CommentService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.commentservice.getComments(this.docid).subscribe(
      res => {
        res.forEach(comment => this.data.push(comment.commentinfo));
      },
      error => {
        console.log('加载评论失败');
      }
    )
  }

  //评论区数据
  data: DocComment[] = [
    new class implements DocComment{
      commentid = '001';
      creatorname = 'Han Solo';
      creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      content =
        'We supply a series of design principles, practical patterns and high quality design resources \
        (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
      createtime = formatDistance(new Date(), addDays(new Date(), 1));
      children = [
        new class implements DocComment{
          commentid = '001';
          creatorname = 'Han Solo';
          creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
          content =
            'We supply a series of design principles, practical patterns and high quality design resources \
            (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
          createtime = formatDistance(new Date(), addDays(new Date(), 1));
          children = [];
        },
        new class implements DocComment{
          commentid = '001';
          creatorname = 'Han Solo';
          creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
          content =
            'We supply a series of design principles, practical patterns and high quality design resources \
            (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
          createtime = formatDistance(new Date(), addDays(new Date(), 1));
          children = [];
        },
      ];
    },
    new class implements DocComment{
      commentid = '001';
      creatorname = 'Han Solo';
      creatoravatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png';
      content =
        'We supply a series of design principles, practical patterns and high quality design resources \
        (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
      createtime = formatDistance(new Date(), addDays(new Date(), 1));
      children = [];
    },
  ];

  submitting = false;
  user = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  inputValue = '';



  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleSubmit(): void {
    this.submitting = true;
    const content = this.inputValue;
    this.commentservice.createComment(this.docid, content).subscribe(
      res => {
        if (res.msg === 'true') {
          this.inputValue = '';
          this.submitting = false;
          this.message.create('success', '提交成功');
        }
        else {
          this.submitting = false;
          this.message.create('error', '提交失败，请稍后再试');
        }
      },
      error => {
        this.submitting = false;
        this.message.create('error', '奇怪的错误增加了，请稍后再试');
      }

    )
    // this.inputValue = '';
    // setTimeout(() => {
    //   this.submitting = false;
    //   this.data = [
    //     ...this.data,
    //     {
    //       ...this.user,
    //       content,
    //       displayTime: formatDistance(new Date(), new Date())
    //     }
    //   ].map(e => {
    //     return {
    //     };
    //   });
    // }, 800);
  }

}
