export class Order {    
    constructor(
        public id: number,
        public services: Services[],
        public status: string,
        public observations: string,
        public totalCharged: number| undefined,
        public infoClient: string | undefined,
    ) {}
}


export class client {
    constructor(
        public document: string,
        public names: string,
        public phone: number,
        public phone1: number,
        public phone2: number,
        public email: string,
        public address: string,
        public nameOfApplicant: string,
        public numberOrderVendor: string,
        public type: string
    ) {}
}

export class Services {    
    constructor(
        public id: string | undefined,
        public servicesType: string,
        public servicesDescription: string,
        public price: number,
    ) {}  
}

export class Schedule {    
    constructor(
        public id: string | undefined,
        public date: string,
        public hour: string,
        public idUser: number,
        public idOrder: number
    ) {}  
}