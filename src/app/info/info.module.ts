import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

const ROUTES: Routes = [
  { path: '', component: InfoComponent }
];

@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class InfoModule { }
