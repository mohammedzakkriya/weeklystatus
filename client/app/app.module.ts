import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent }  from './app.component';
import { routing } from './app.routing';


import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from './_guards/index';
import { JwtInterceptorProvider, ErrorInterceptorProvider } from './_helpers/index';
import { AlertService, AuthenticationService, UserService, TaskService, ProjectService, HeaderDataService} from './_services/index';
import { HomeComponent } from './home/index';
import { HeaderComponent } from './header/index';
import { UserComponent } from './user/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ProjectComponent } from './project/index';
import { AlertComponent, NgbdModalBasic } from './_directives/index';

@NgModule({
    imports: [
        NgbModule.forRoot(),
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        UserComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        NgbdModalBasic,
        ProjectComponent
    ],
    providers: [
        NgbActiveModal,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        TaskService,
        ProjectService,
        JwtInterceptorProvider,
        ErrorInterceptorProvider,
        HeaderDataService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }