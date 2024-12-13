export class AuthUser {
    constructor(public email: string,
                public token: string,
                public role: string,
                public userId: number,
                public name: string)
                {}
}
