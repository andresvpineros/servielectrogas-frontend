export interface Users {
    id: string | undefined;
    name: string;
    email: string;
    password: string;
    type: string;
}

export class UsersModel implements Users {
    constructor(
        public id: string | undefined,
        public name: string,
        public email: string,
        public password: string,
        public type: string
    ) { }
}
