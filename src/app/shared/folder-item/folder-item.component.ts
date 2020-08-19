import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})
export class FolderItemComponent implements OnInit {
  @Input() public folderName: string;
  @Input() public folderId: string;

  constructor(
    private router: Router,
    private breadService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate(['/folder/' + this.folderId]).then();
  }

}
