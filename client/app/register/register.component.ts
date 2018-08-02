import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { appConfig } from '../app.config';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit{
    model: any = {};
    loading = false;
    usersList: any = [];
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

        ngOnInit() {
            //this.loading = true;
            
              
        }
        register() {
            this.loading = true;
            if(this.model.registrationCode==appConfig.secretRegistrationCode) {
            this.userService.newRegistration(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
            } else {
                this.alertService.error('Please enter valid Registration Code');
                this.loading = false;
            }
        }
}
