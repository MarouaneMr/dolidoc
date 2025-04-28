class UserService {
    private currentUser: any = null;
  
    getCurrentUser() {
      return this.currentUser;
    }
  
    setCurrentUser(user: any) {
      this.currentUser = user;
    }
  }
  
  export const userService = new UserService();
  