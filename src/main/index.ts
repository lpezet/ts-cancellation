import { sayHello, User } from "./sayHello";
import sayBye from "@this/something/sayBye"; // testing default export

const user: User = { name: "TypeScript" };
sayHello(user);
sayBye(user);
