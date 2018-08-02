import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../app.config';
import { Task } from '../_models';

@Injectable()
export class TaskService {
    constructor(private http: HttpClient) { }

    getAll(obj: any) {
        return this.http.post<Task[]>(appConfig.apiUrl + '/tasks', obj);
    }
    getAllPendingTasks(obj: any) {
        return this.http.post<Task[]>(appConfig.apiUrl + '/tasks/pendingtasks', obj);
    }
    getById(_id: string) {
        return this.http.get(appConfig.apiUrl + '/tasks/' + _id);
    }

    create(task: Task) {
        return this.http.post(appConfig.apiUrl + '/tasks/newtask', task);
    }

    update(task: Task) {
        return this.http.put(appConfig.apiUrl + '/tasks/' + task._id, task);
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/tasks/' + _id);
    }
}