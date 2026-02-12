


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
    images?: Array<MovieImage> | null
    image?: File[] | null
};

export type MovieImage = {
    id: number,
    key: string,
    movie_id: number,
    mime_type: string,
    movie_title: string,
    original_name: string
    url: string,
}


export type MovieUrl = {
    url: string,
    type: string,
    title: string
}

export type MovieUpload = {
    title: string,
    genre: string,
    description: string | null,
    length: string | null,
    year: number | null,
    file: File | null,
    folder?: File[],
    images: File[]
};