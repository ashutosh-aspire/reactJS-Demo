export class AuthGuardService {
    
    canActivate() {
            if ((localStorage.getItem('auth') && localStorage.getItem('user'))) {
              return true;
            }
            return false;
    }
}