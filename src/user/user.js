"use strict";
class User {
    constructor(user = { name: '', id: -1 }) {
        this.id = user.id;
        this.name = user.name;
        console.log('SOMETHING');
    }
}
exports.User = User;
;
