export class User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    manager: string;
    active: boolean;
    projects: Array<string>
}