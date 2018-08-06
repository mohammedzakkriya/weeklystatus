import { Component, OnDestroy } from '@angular/core';

import { Project, User } from '../_models/index';
import { UserService, AlertService } from '../_services/index';
import { ProjectService } from '../_services/index';
import { HeaderDataService } from '../_services/index';
import { Subscription } from 'rxjs/Subscription';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
    moduleId: module.id,
    templateUrl: 'project.component.html'
})

export class ProjectComponent implements OnDestroy {
    currentUser: User;
    editProjects: Project[] = [];
    editmode: boolean = false;
    addmode: boolean = false;
    userData: any = [];
    loading = false;
    projectLists : any = [];
    usersList: User[] = [];
    currentURL: string='home';
    firstdayOfWeek: Date;
    lastDayOfWeek: Date;
    model: any = {};
    private subscription: Subscription;
    constructor(private modalService: NgbModal, private userService: UserService,  private projectService: ProjectService, private headerDataService:  HeaderDataService, private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = true;
      this.subscription = this.headerDataService.getState().subscribe(
        userData => {
          this.userData = userData;
          console.log('data service: ', this.userData);
          this.loadAllProjects();
          this.loadAllUsers();
        });
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    private loadAllProjects() {

        this.projectService.getAll().subscribe(projects => { 

            this.projectLists = projects;
            console.log('projects:', this.projectLists);
            this.loading = false;
        });
    }
    AddNewProject() {
        this.addmode = true;
    }
    CreateProject() {
        this.loading = true;
        console.log('nodel data:', this.model);
        // let reportingManager =  this.model.manager;
        this.model.managedby = this.userData.username;
        this.projectService.create(this.model)
        .subscribe(
            data => {
                this.alertService.success('User created successfully', true);
                //this.router.navigate(['/login']);
                this.loadAllProjects();
               
               
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
        
        
    }
    
    editProject(project: Project) {
        console.log(project)
        this.editmode = true;
        //task.date = new Date();
        if(this.projectLists.includes(project)){
            if(!this.editProjects.includes(project)){
            this.editProjects.push(project)
            }else{
            this.editmode = false;
            this.editProjects.splice(this.editProjects.indexOf(project), 1)
            this.projectService.update(project).subscribe(res => {
                console.log('Update Succesful')
                this.loading = false;
            }, err => {
                this.editProject(project);
                console.error('Update Unsuccesful')
            })
            }
        }
    }
    doneProject(project:Project){
    //task.status = 'Done'
        this.editProject(project);//
    }
    deleteProject(_id: string) {
        this.loading = true;
            this.projectService.delete(_id).subscribe(() => { this.loadAllProjects() });
    }
    loadAllUsers(){
        this.userService.getAll()
            .subscribe(
                data => {
                    //this.alertService.success('User created successfully', true);
                    
                    //this.router.navigate(['/login']);
                    this.usersList = data;
                    
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}