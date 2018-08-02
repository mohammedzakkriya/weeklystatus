import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../app.config';
import { Project } from '../_models/index';

@Injectable()
export class ProjectService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.post<Project[]>(appConfig.apiUrl + '/projects',{});
    }

    create(project: Project) {
        return this.http.post(appConfig.apiUrl + '/projects/new', project);
    }

    update(project: Project) {
        return this.http.put(appConfig.apiUrl + '/projects/' + project._id, project);
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/projects/' + _id);
    }
}