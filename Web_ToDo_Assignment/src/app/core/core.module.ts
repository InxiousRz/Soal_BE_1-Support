import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideNavComponent } from './side-nav/side-nav.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { ErrorDialogueComponent } from './error-dialogue/error-dialogue.component';



@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    TodoListComponent,
    TaskDetailComponent,
    TaskFormComponent,
    ConfirmationDialogComponent,
    LoginPageComponent,
    SideNavComponent,
    SearchpageComponent,
    ErrorDialogueComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    DashboardComponent,
    TaskDetailComponent
  ]
})
export class CoreModule { }
