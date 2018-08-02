export class Task {
    _id:string;
    title: string;
    //description: string;
    date: Date;
    status: string;
    project: string;
    user: string;

    constructor(
    ){
        this.title = ""
        //this.description = ""
        this.date = new Date()
        this.status = ""
        this.project = ""
        this.user= "";
    }
}