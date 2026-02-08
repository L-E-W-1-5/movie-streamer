


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

export interface MovieDownloadNew {
    id: number,
    title: string,
    key: string,
    description: string | null,
    length: string | null,
    year: number | null,
    genre: string | null,
    timestamp: Date,
    times_played: number,
    images: Array<MovieImage> | null
};

export type MovieImage = {
    id: number,
    filename: string,
    mime_type: string,
    buffer: string
}


export type MovieUrl = {
    url: string,
    type: string,
    title: string
}