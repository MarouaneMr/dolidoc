class UserInfoService {
    private currentUser: any = null;
  
    getCurrentUser() {
      return this.currentUser;
    }
  
    setCurrentUser(user: any) {
      this.currentUser = user;
    }
  }
  
  export const userInfoService = new UserInfoService();
  