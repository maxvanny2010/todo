import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TasksComponent} from './view/tasks/tasks.component';
import {CategoriesComponent} from './view/categories/categories.component';
import {EditTaskDialogComponent} from './dialog/edit-task-dialog/edit-task-dialog.component';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {TaskDatePipe} from './pipe/task-date.pipe';

import {registerLocaleData} from '@angular/common';
import localRu from '@angular/common/locales/ru';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {EditCategoryDialogComponent} from './dialog/edit-category-dialog/edit-category-dialog.component';
import {FooterComponent} from './view/footer/footer.component';
import {AboutDialogComponent} from './dialog/about-dialog/about-dialog.component';
import {HeaderComponent} from './view/header/header.component';
import {StatComponent} from './view/stat/stat.component';
import {StatCardComponent} from './view/stat/stat-card/stat-card.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {SettingsDialogComponent} from './dialog/settings-dialog/settings-dialog.component';
import {PrioritiesComponent} from './view/priorities/priorities.component';
import {EditPriorityDialogComponent} from './dialog/edit-priority-dialog/edit-priority-dialog.component';
import {SidebarModule} from 'ng-sidebar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CATEGORY_URL_TOKEN} from './data/dao/impl/category.service';
import {PRIORITY_URL_TOKEN} from './data/dao/impl/priority.service';
import {TASK_URL_TOKEN} from './data/dao/impl/task.service';
import {STAT_URL_TOKEN} from './data/dao/impl/stat.service';
import {SpinnerInterceptor} from './interceptor/spinner.interceptor';

registerLocaleData(localRu);

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent,
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    TaskDatePipe,
    EditCategoryDialogComponent,
    FooterComponent,
    AboutDialogComponent,
    HeaderComponent,
    StatComponent,
    StatCardComponent,
    SettingsDialogComponent,
    PrioritiesComponent,
    EditPriorityDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ColorPickerModule,
    SidebarModule.forRoot(),
    MatSidenavModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ],
  providers: [
    {
      provide: CATEGORY_URL_TOKEN,
      useValue: 'http://localhost:8080/category'
    },
    {
      provide: PRIORITY_URL_TOKEN,
      useValue: 'http://localhost:8080/priority'
    },
    {
      provide: TASK_URL_TOKEN,
      useValue: 'http://localhost:8080/task'
    },
    {
      provide: STAT_URL_TOKEN,
      useValue: 'http://localhost:8080/stat'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
