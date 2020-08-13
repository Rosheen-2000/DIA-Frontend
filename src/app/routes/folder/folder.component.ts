import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FolderService} from './folder.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() type: string;
  // user space folder

  @Input() rootName: string;
  @Input() rootType: string;

  @Input() spaceId: string;

  private folderId: string;
  public subFolders: {Id: string, Name: string}[];
  public subFiles: {id: string, name: string}[] = [];
  public path: {Id: string, Name: string}[];
  constructor(
    private route: ActivatedRoute,
    private folderService: FolderService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.folderId = params.id;
      if (this.folderId) {
        return;
      }
    });
    if (this.type === 'user'){
      // this.subFolders = this.folderService.getSubFolders();
      this.folderService.getFiles(this.rootType).subscribe(
        res => this.subFiles = res
      );
      // this.subFiles = [
      //   {id: this.rootType + 'File1', name: this.rootType + 'File1'},
      //   {id: this.rootType + 'File2', name: this.rootType + 'File2'}
      // ];
      // this.path = this.folderService.getFolderPath();
    }
  }

}
