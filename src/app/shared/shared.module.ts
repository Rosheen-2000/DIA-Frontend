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

const Components = [
  LogoComponent,
  DocItemComponent,
  FileSystemComponent,
  FolderItemComponent,
  TemplateModalComponent,
  TeamSettingComponent
];

@NgModule({
  exports: [
    ...Components
  ],
  declarations: [...Components, TeamSettingComponent],
    imports: [
        RouterModule,
        NzIconModule,
        NgZorroAntdModule,
        NzInputModule,
        FormsModule,
        NzGridModule,
        CommonModule,
    ]
})
export class SharedModule {
}
