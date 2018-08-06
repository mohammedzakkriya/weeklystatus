import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models/index';
import { Task } from '../_models/index';
import { TaskService } from '../_services/index';
import { UserService } from '../_services/index';
//import { ProjectService } from '../_services';
import { HeaderDataService, ReportService } from '../_services/index';
import { Subscription } from 'rxjs/Subscription';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnDestroy {
    currentUser: User;
    tasks: Task[] = [];
    pendingTasks: Task[] =[];
    currentWeekTasks: Task[] = [];
    newTask: any = {};
    editTasks: Task[] = [];
    editmode: boolean = false;
    userData: any = [];
    loading = false;
    generatedArray: any = [];
    projects: any = []; 
    projectLists : any = [];
    userGroup: any = [];
    currentURL: string='home';
    firstdayOfWeek: Date;
    lastDayOfWeek: Date;
    projectActivitiesDataReport:any= {
      current: [],
      upcoming: []
    };
    modalData: any = { 'header': 'Current Activities'};
    private subscription: Subscription;
    constructor(private router: Router, private modalService: NgbModal, private userService: UserService, private taskService: TaskService, private headerDataService:  HeaderDataService, private reportService: ReportService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = true;
      this.subscription = this.headerDataService.getState().subscribe(
        userData => {
          this.userData = userData;
          console.log('data service: ', this.userData);
          this.loadAllTasks(this.userData);
          
        });
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    saveReport(reportObj: any) {
      this.loading = true;
      //.log('nodel data:', this.model);
      let obj = {
          reportByActivities : reportObj,
          user: this.userData.username,
          date: new Date()
      }
      
      this.reportService.create(obj)
      .subscribe(
          data => {
              //this.alertService.success('User created successfully', true);
              //this.router.navigate(['/login']);
              //this.loadAllProjects();
              this.loading = false;
              this.router.navigate(['/routes']);
          },
          error => {
              //this.alertService.error(error);
              this.loading = false;
          });
      
      
  }
  
    generateReportByActivities() {
     // let activitiesArray: any = {
        this.projectActivitiesDataReport.current= this.getActivitiesData(this.tasks, this.userGroup, 'current');
        this.projectActivitiesDataReport.upcoming= this.getActivitiesData(this.tasks, this.userGroup, 'upcoming');
        
      //this.projectActivitiesDataReport = activitiesArray;
      console.log('generateReportByActivities', this.projectActivitiesDataReport); 
    }
    getActivitiesData(tasks: any, users: any, category: string) {
      let resultData: any = [
       
      ];
      for(let l=0; l<this.projectLists.length; l++) {
          var newobj: any = {
            projectname: this.projectLists[l],
            projectTasks: [] 
          }
          resultData.push(newobj);
        for(let m=0; m< users.length; m++) {
          for(let n=0; n<tasks.length; n++) {
            if(category == 'current') {
              if(tasks[n].user === users[m].username && (tasks[n].status == 'inprogress' || tasks[n].status == 'completed') && tasks[n].project==this.projectLists[l]) {
                resultData[l].projectTasks.push({
                  title: this.tasks[n].title,
                  status: this.tasks[n].status,
                  user: this.tasks[n].user,
                  date: this.tasks[n].date 
                });
              }
            } else if(category == 'upcoming') {
              if(tasks[n].user === users[m].username && (tasks[n].status == 'onhold' || tasks[n].status == 'notstarted') && tasks[n].project==this.projectLists[l]) {
                resultData[l].projectTasks.push({
                  title: this.tasks[n].title,
                  status: this.tasks[n].status,
                  user: this.tasks[n].user,
                  date: this.tasks[n].date 
                });
              }
            }
          }
        }
      }
      //console.log('', resultData);
      return resultData;
      
    }
    generateReportByProject() {
      var projectArray: any= [];
      
      for(var _j = 0; _j < this.projectLists.length; _j++) {
        var newProjArray: object = {
          projectName:  this.projectLists[1],
          projectData: this.getProjectData(this.projectLists[1])
        }
        projectArray.push(newProjArray);
       
      }
      console.log('generateReportByProject:', projectArray);
    }
    getProjectData(projectname: string) {
      var resultData: any = [];
      //console.log(this.tasks);
      for(var _j = 0; _j < this.tasks.length; _j++) {
        //console.log('projectname: ',this.tasks[_j]);
        if(_j==0 || (_j >0 && this.tasks[_j-1].user !== this.tasks[_j].user)) {
          
          
        if(this.tasks[_j].project==projectname) {
          var newProjArray: object = {
            user:  this.tasks[_j].user,
            currentTask: this.getTaskData(projectname, this.tasks[_j].user, 'current'),
            upcomingTask: this.getTaskData(projectname, this.tasks[_j].user, 'upcoming')
          }
          //console.log('projectname: ',projectname);
          resultData.push(newProjArray);
        }
        }
      }
      return resultData;
    }
    
    getTaskData(projectname: string, user: string, category: string) {
      var resultData: any = [];
      for(var _j = 0; _j < this.tasks.length; _j++) {
        if(category == 'current') {
          if(this.tasks[_j].user == user && this.tasks[_j].project == projectname && (this.tasks[_j].status =='inprogress' || this.tasks[_j].status =='completed')) {
            resultData.push({
              title: this.tasks[_j].title,
              status: this.tasks[_j].status,
              date: this.tasks[_j].date 
            });
          } 
        } else if(category == 'upcoming') {
          if(this.tasks[_j].user == user && this.tasks[_j].project == projectname && (this.tasks[_j].status =='onhold' || this.tasks[_j].status =='notstarted')) {
            resultData.push({
              title: this.tasks[_j].title,
              status: this.tasks[_j].status,
              date: this.tasks[_j].date 
            });
          } 
        }
      }
      return resultData;
    }
    generateReportByUser() {
      var task: Task;
      var newArray = [];
      var recordCount = 0;
     
        for(var _i = 0; _i < this.tasks.length; _i++) {
          var newObj: any = {
            "user": "",
            "current": [],
            "upcoming": []
          };
          task = this.tasks[_i];
          //console.log('task',task );
          if(_i==0) {
            newObj.user = this.tasks[_i].user;
            if(this.tasks[_i].status=='inprogress' || this.tasks[_i].status=='completed') {
              newObj.current.push({
                "title" : task.title,
                "status": task.status,
                "project": task.project
              });
            } else {
              newObj.upcoming.push({
                "title" : task.title,
                "status": task.status,
                "project": task.project
              });
            }
            newArray.push(newObj);
          }
          if(_i > 0 && this.tasks[_i-1].user === this.tasks[_i].user) {
            
            if(this.tasks[_i].status=='inprogress' || this.tasks[_i].status=='completed') {
              newArray[recordCount].current.push({
                "title" : task.title,
                "status": task.status,
                "project": task.project
              });
            } else {
              newArray[recordCount].upcoming.push({
                "title" : task.title,
                "status": task.status,
                "project": task.project
              });
            }
          } 
          
          if(_i > 0 && this.tasks[_i-1].user !== this.tasks[_i].user) {
            recordCount = recordCount +1;
            newArray.push(newObj);
            newArray[recordCount].user = task.user;
            newArray[recordCount].current = [];
            newArray[recordCount].upcoming = [];
            if(this.tasks[_i].status=='inprogress' || this.tasks[_i].status=='completed') {
              newArray[recordCount].current.push({
                "title" : task.title,
                "status": task.status,
                "project": task.project
              });
            } else {
              newArray[recordCount].upcoming.push({
                "title": task.title,
                "status": task.status,
                "project": task.project
              });
            }
          }
          
        }
      
      console.log('generateReportByUser: ', newArray);
      //alert('Task Data: '+newArray);
      this.generatedArray = newArray;
    }
    deleteTask(_id: string) {
      this.loading = true;
        this.taskService.delete(_id).subscribe(() => { this.loadAllTasks(this.userData) });
    }
    
    create(newTask: Task) {
      this.loading = true;
        newTask.user = this.currentUser.username;
        //newTask.date = new Date();
        //console.log(newTask);
        this.taskService.create(newTask).subscribe(() => { this.loadAllTasks(this.userData) });
    }

    editTask(task: Task) {
    console.log(task)
    this.editmode = true;
    
    //task.date = new Date();
    if(this.tasks.includes(task)){
      if(!this.editTasks.includes(task)){
        this.editTasks.push(task)
      }else{
        this.editmode = false;
        this.editTasks.splice(this.editTasks.indexOf(task), 1)
        this.loading = true;
        this.taskService.update(task).subscribe(res => {
          console.log('Update Succesful')
          this.loading = false;
        }, err => {
          this.editTask(task);
          console.error('Update Unsuccesful');
          this.loading = false;
        })
      }
    }
  }
  open(content: any) {
    this.generateReportByActivities();
    this.modalService.open(content, { centered: true, size : 'lg' });
  }
  doneTask(task:Task){
    //task.status = 'Done'
    
    this.editTask(task);//
  }
  submitTask(event: any, task:Task){
    if(event.keyCode ==13){
      this.editTask(task)
    }
  }//
  private loadAllTasks(user: User) {
    var curr = new Date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
    this.firstdayOfWeek = firstday;
    this.lastDayOfWeek = lastday;
      var queryObjForCurrentWeek = {
        firstday: firstday,
        lastday: lastday,
        user: user.username,
        role: user.role
      }
    if(user.role=='manager') {
      this.userService.getAllByUser(user).subscribe(users => { 
        this.userGroup = users; 
        this.taskService.getAllPendingTasks(queryObjForCurrentWeek).subscribe(pendingTasks => { 
          this.pendingTasks = pendingTasks; 
         
          this.pendingTasks = this.getTeamTasks(pendingTasks, this.userGroup);
          this.taskService.getAll(queryObjForCurrentWeek).subscribe(tasks => { 
            this.currentWeekTasks = tasks;
            this.currentWeekTasks = this.getTeamTasks(this.currentWeekTasks, this.userGroup);
            this.tasks = this.pendingTasks.concat(this.currentWeekTasks);
            //console.log('All Task:',this.tasks);
            this.loadAllProjects(this.userData);
          });
        });
      });
      
    } else {
      this.taskService.getAllPendingTasks(queryObjForCurrentWeek).subscribe(pendingTasks => { 
        this.pendingTasks = pendingTasks; 
        this.taskService.getAll(queryObjForCurrentWeek).subscribe(tasks => { 
          this.currentWeekTasks = tasks;
          this.tasks = this.pendingTasks.concat(this.currentWeekTasks);
          this.loadAllProjects(this.userData);
        });  
      });
    }  
  }
  private getTeamTasks(tasks: Task[], users: any) {
    let resultData = [];
    for(let _k=0; _k< users.length; _k++) {
      for(let _m=0; _m< tasks.length; _m++) {
        if(tasks[_m].user == users[_k].username) {
          resultData.push(tasks[_m]);
        }
      }
    }
    return resultData;
  }
  private getTeamProject(tasks: Task[], users: any) {
    let resultData = [];
    for(let _k=0; _k< users.length; _k++) {
      for(let _m=0; _m< tasks.length; _m++) {
        if(tasks[_m].user == users[_k].username) {
          resultData.push({projectname: tasks[_m].project});
        }
      }
    }
    console.log('Team projects:', resultData)
    return resultData;
  }
  private loadAllProjects(user: User) {
     this.projectLists = user.projects;
     this.loading = false;
  }
  removeDuplicates(arr: any, category: any){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i][category]) == -1){
            unique_array.push(arr[i][category])
        }
    }
    return unique_array
}
}