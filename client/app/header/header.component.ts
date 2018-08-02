import { Component, OnInit, Input } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { HeaderDataService } from '../_services/index';

@Component({
    selector: 'app-header',
    moduleId: module.id,
    templateUrl: 'header.component.html'
})

export class HeaderComponent implements OnInit {

    users: User[] = [];
    currentUser: any;

    constructor(private userService: UserService, private headerDataService: HeaderDataService) {

       
        //this.currentUser = currentUser;
        
    }

    ngOnInit() {
        //this.loadAllUsers();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userService.getById(this.currentUser._id).subscribe(user => { 
            this.currentUser = user; 
            this.headerDataService.setState(this.currentUser);
        });

    }

    
}