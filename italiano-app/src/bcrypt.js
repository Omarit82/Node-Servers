import {hashSync,compareSync,genSaltSync} from 'bcrypt';

export const encriptar = (password) => {
    return hashSync(password,genSaltSync(parseInt(process.env.SALT)));
}

export const desencriptar = (input,pass) => {
    return compareSync(input,pass);
}

