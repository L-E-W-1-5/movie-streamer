


export type User = {
    id: string,
    name: string,
    email: string,
    guid: string,
    is_verified: boolean,
    is_admin: boolean,
}

export type UserEdit = {
    id: number,
    username: string,
    email: string,
    guid: string,
    is_admin: boolean,
    is_verified: boolean,
    pin_number: string,
    is_loggedin: boolean,
    login_attempts: number,
    time_created: Date,
    last_login: Date
}