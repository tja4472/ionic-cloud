export class TodoCompleted {
    id: string;
    isComplete: boolean;    
    description?: string;
    name: string;
    userId: string;     

    constructor(
        // id: string,
        isComplete: boolean,
        userId: string,
        name: string,
        description?: string,        
    ) {
        this.id = undefined;
        this.description = description;
        this.isComplete = isComplete;
        this.userId = userId;
        this.name = name;
    }      
}

/*
export interface TodoCompleted {
    id: string;
    description?: string;
    name: string;
    isComplete: boolean;
    userId: string;       
}
*/
