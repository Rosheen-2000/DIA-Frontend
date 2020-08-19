import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-folder-route',
  templateUrl: './folder-route.component.html',
  styleUrls: ['./folder-route.component.scss']
})
export class FolderRouteComponent implements OnInit {
  public folderId: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.folderId = params.id;
    });
  }

}
