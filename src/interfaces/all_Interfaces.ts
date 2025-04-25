                    
                    //          ALL INTERFACES


// password interface
export interface CreatePasswordEntry {
    title: string
    username: string
    password: string
}

// user interface
export interface IUser {
    id: string
    name: string
    email: string
    hashPassword: string
    role: 'BASIC' | 'ADMIN'
}