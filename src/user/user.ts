/**
 * 
 * 
 * @export
 * @class User
 */
export class User {
  id: number;
  name: string;

  constructor(user: { name: string, id: number } = { name: '', id: -1 }) {
      this.id = user.id;
      this.name = user.name;
  }
    
};