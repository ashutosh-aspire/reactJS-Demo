import {LocalStorageService} from "./localStorageService.js";

export class IsLoggedIn {
    localStorageService = new LocalStorageService
    
    canActivate() {
        if (this.localStorageService.getValue('accessToken')) {
          return false;
        }
        return true;
      }
}