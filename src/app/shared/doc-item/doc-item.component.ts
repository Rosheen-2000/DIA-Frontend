import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd";
import {DocItemService} from "./doc-item.service";

@Component({
  selector: 'app-doc-item',
  templateUrl: './doc-item.component.html',
  styleUrls: ['./doc-item.component.scss']
})
export class DocItemComponent implements OnInit {
  @Input() public fileName: string;
  @Input() public fileId: string;

  @Input() public isTrash: boolean;

  constructor(
    private router: Router,
    private nzContextMenuService: NzContextMenuService,
    private docItemService: DocItemService,
  ) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate(['/docs/' + this.fileId]).then();
  }

  createMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  rename(): void {
    console.log(this.fileId);
    this.docItemService.rename('??', '??').subscribe(
      res => console.log(res)
    );
  }

  delete(): void {
    this.docItemService.deleteDoc(this.fileId).subscribe(
      res => console.log(res)
    );
  }

  recovery(): void {
    this.docItemService.recoveryDoc(this.fileId).subscribe(
      res => console.log(res)
    );
  }

  confirmDelete(): void {
    this.docItemService.confirmDeleteDoc(this.fileId).subscribe(
      res => console.log(res)
    );
  }
}
