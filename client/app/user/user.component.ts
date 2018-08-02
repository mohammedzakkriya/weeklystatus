import { HeaderDataService } from '../_services/headerData.service';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/index';
import { AlertService, UserService } from '../_services/index';
import { Subscription } from 'rxjs/Subscription';
@Component({
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnDestroy{
    model: any = {};
    loading = false;
    usersList: any = [];
    editmode: boolean = false;
    editUsers: any = [];
    addmode: boolean = false;
    currentUser: User;
    userData: any;
    private subscription: Subscription;
    projects: any = [];
    projectLists: any= [];
    selectedProjects: any = [];
    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private headerDataService: HeaderDataService) { 
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = true;
        this.subscription = this.headerDataService.getState().subscribe(
            userData => {
            this.userData = userData;
            //console.log('data service: ', this.userData);
            this.loadAllUsers(this.userData);
            this.loadAllProjects(this.userData);
            });
        }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    AddNewUser() {
        this.addmode = true;
    }
    CreateUser() {
        this.loading = true;
        console.log('nodel data:', this.model);
        let reportingManager =  this.model.manager;
        
        this.userService.createNewUser(this.model, reportingManager)
        .subscribe(
            data => {
                this.alertService.success('User created successfully', true);
                //this.router.navigate(['/login']);
                this.loadAllUsers(this.userData);
               
               
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
        
        
    }
    loadAllUsers(user: any) {
        this.loading = true;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('current user:'+this.currentUser);
        if(user.role=='admin') {
        this.userService.getAll()
            .subscribe(
                data => {
                    //this.alertService.success('User created successfully', true);
                    
                    //this.router.navigate(['/login']);
                    this.usersList = data;
                    this.loading = false;
                    this.addmode = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        } else if(user.role=='manager'){

            this.userService.getAllByUser(this.currentUser)
                .subscribe(
                    data => {
                        //this.alertService.success('User created successfully', true);
                        
                        //this.router.navigate(['/login']);
                        this.usersList = data;
                        this.loading = false;
                    this.addmode = false;
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });
        }
    }
    editUser(user: User) {
        console.log(user)
        this.editmode = true;
        //task.date = new Date();
        if(this.usersList.includes(user)){
            if(!this.editUsers.includes(user)){
            this.editUsers.push(user)
            }else{
            this.editmode = false;
            this.editUsers.splice(this.editUsers.indexOf(user), 1)
            this.userService.update(user).subscribe(res => {
                console.log('Update Succesful')
                this.loading = false;
            }, err => {
                this.editUser(user);
                console.error('Update Unsuccesful')
            })
            }
        }
    }
    doneUser(user:User){
    //task.status = 'Done'
        this.editUser(user);//
    }
    deleteUser(_id: string) {
        this.loading = true;
            this.userService.delete(_id).subscribe(() => { this.loadAllUsers(this.userData) });
    }
    selectProjects(options : any) {
        this.selectedProjects = Array.apply(null,options);
        console.log('projects', this.selectedProjects);
    }
    private loadAllProjects(user: User) {
        this.projectLists = user.projects;
        this.loading = false;
    }
}
