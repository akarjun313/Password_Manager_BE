export interface IUser {
    name: string
    email: string
    password: string
    hashPassword: string
    role: 'BASIC' | 'ADMIN'
}