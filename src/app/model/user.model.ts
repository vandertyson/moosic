export class User {
  public id: number;
  public name: string;
  public email: string;
  public phone_1: string;
  public phone_2: string;
  public role_id: string;
  public team_sale: any;

  public password: string;
  public created_at: {
    date: string;
    timezone_type: number;
    timezone: string;
  }
  public active: boolean = true;
  public avatar: string;
  public organization: any;
  static Equal(user1: User, user2: User): boolean {
    if (JSON.stringify(user1) === JSON.stringify(user2)) {
      return true;
    }
    return false;
  }
  static Reset(user: User): void {
    user.email = '';
    user.name = '';
    user.phone_1 = '';
    user.phone_2 = '';
    user.role_id = '';
  }
}

export class UserPostParam {
  public users = new Array();
}
