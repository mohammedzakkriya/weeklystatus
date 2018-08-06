import { Component, OnDestroy } from '@angular/core';

import { Project, User } from '../_models/index';
import { UserService, AlertService } from '../_services/index';
import { ReportService } from '../_services/index';
import { HeaderDataService } from '../_services/index';
import { Subscription } from 'rxjs/Subscription';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
    moduleId: module.id,
    templateUrl: 'reports.component.html'
})

export class ReportsComponent implements OnDestroy {
    currentUser: User;
    editProjects: Project[] = [];
    editmode: boolean = false;
    addmode: boolean = false;
    userData: any = [];
    loading = false;
    reportList : any = [];
    usersList: User[] = [];
    currentURL: string='home';
    firstdayOfWeek: Date;
    lastDayOfWeek: Date;
    model: any = {};
    private subscription: Subscription;
    constructor(private modalService: NgbModal, private userService: UserService,  private reportService: ReportService, private headerDataService:  HeaderDataService, private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = true;
      this.subscription = this.headerDataService.getState().subscribe(
        userData => {
          this.userData = userData;
          console.log('data service: ', this.userData);
          this.loadAllReports();
          this.loadAllUsers();
        });
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    
    private loadAllReports() {

        this.reportService.getAll().subscribe(reports => { 

            this.reportList = reports;
            console.log('reports:', this.reportList);
            this.loading = false;
        });
    }
   
    
    deleteReport(_id: string) {
        this.loading = true;
            this.reportService.delete(_id).subscribe(() => { this.loadAllReports() });
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