import {hashSync,compareSync,genSaltSync} from 'bcrypt';

export const encriptar = (password) => {
    return hashSync(password,genSaltSync(parseInt(process.env.SALT)));
}

export const paswordCheck = (input,pass) => {
    return compareSync(input,pass);
}

