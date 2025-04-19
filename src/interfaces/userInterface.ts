export interface IUser {
    name: string
    email: string
    password: string
    role: 'BASIC' | 'ADMIN'
}