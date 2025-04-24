                    
                    //          ALL INTERFACES


// password interface
export interface CreatePasswordEntry {
    title: string
    username: string
    password: string
}

// user interface
export interface IUser {
    name: string
    email: string
    password: string
    hashPassword: string
    role: 'BASIC' | 'ADMIN'
}