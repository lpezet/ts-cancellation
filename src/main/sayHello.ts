export interface User {
  name: string;
}

export const sayHello = (user: User): string => `Hello ${user.name}!`;
export default sayHello;
