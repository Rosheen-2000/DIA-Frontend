import {NgModule} from '@angular/core';

import {LogoComponent} from './logo/logo.component';
import {DocItemComponent} from './doc-item/doc-item.component';
import {FileSystemComponent} from './file-system/file-system.component';
import {NgZorroAntdModule, NzButtonModule, NzIconModule} from 'ng-zorro-antd';
import {RouterModule} from '@angular/router';
import { FolderItemComponent } from './folder-item/folder-item.component';
import { TemplateModalComponent } from './template-modal/template-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import {CommonModule} from "@angular/common";
import { TeamSettingComponent } from './team-setting/team-setting.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NewfolderModalComponent } from './newfolder-modal/newfolder-modal.component';
import { SharingModalComponent } from './sharing-modal/sharing-modal.component';
import {QRCodeModule} from "angularx-qrcode";
import {ClipboardModule} from "ngx-clipboard";

const Components = [
  LogoComponent,
  DocItemComponent,
  FileSystemComponent,
  FolderItemComponent,
  TemplateModalComponent,
  TeamSettingComponent,
  NewfolderModalComponent,
  SharingModalComponent
];

@NgModule({
  exports: [
    ...Components
  ],
  declarations: [...Components, TeamSettingComponent, NewfolderModalComponent, SharingModalComponent],
  imports: [
    RouterModule,
    NzIconModule,
    NgZorroAntdModule,
    NzInputModule,
    FormsModule,
    NzGridModule,
    CommonModule,
    NzSelectModule,
    QRCodeModule,
    ClipboardModule,
  ]
})
export class SharedModule {
}
