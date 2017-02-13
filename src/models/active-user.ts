export class ActiveUser {
    id: string;
    email: string;
    image: string;
    name?: string;
    userName: string;

    constructor(
        id: string,
        email: string,
        image: string,
        userName: string,
        name?: string,
    ) {
        this.id = id;
        this.email = email;
        this.image = image;
        this.userName = userName;
        this.name = name;
    }
}


// make into class with constructor.
/*
export interface ActiveUser {
    id: string;
    email: string;
    image: string;
    name?: string;
    userName: string;     
}
*/
