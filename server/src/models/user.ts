interface UserJSON {
    email: string;
    password: string;
}


class User{
    static getAll(): UserJSON[]{
        return [
                {email: "John@john.com", password: "123456"},
                {email: "Sam@sam.com", password: "654321"}
            ]
        }
    

    static getOne(userId: number): UserJSON{
        return {email: "John@john.com", password: "123456"}
    }
}

module.exports = User;