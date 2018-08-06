import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../app.config';
import { Report } from '../_models/index';

@Injectable()
export class ReportService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.post<Report[]>(appConfig.apiUrl + '/reports',{});
    }

    create(report: Report) {
        return this.http.post(appConfig.apiUrl + '/reports/new', report);
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/reports/' + _id);
    }
}