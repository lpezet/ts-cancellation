import { User } from "@this/sayHello";

export const sayBye = (user: User): string => `Bye ${user.name}!`;
export default sayBye;
