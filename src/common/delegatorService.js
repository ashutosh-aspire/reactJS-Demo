import Environment from '../common/environments.js';
import {UtilityService} from './utilityService.js';
import {LocalStorageService} from "./localStorageService.js";
import { Base64 } from '../common/base64Service.js';

export class Delegator {


    lockedForRefresh = false;
    delayRequests = {};
    runningRequests = {};
    requestCounter = 0;
    localStorageService = new LocalStorageService


    _fetch = (config) => {
        var status;
        
            if (this.lockedForRefresh && !config.noDelay) {
              this.storeDelayedRequest(config);
            } else {
                const requestId = this.nextRequestId();
                
                // store request's config and store it in runningRequests
                const tracker = {
                    requestId: requestId,
                    config: config
                };
                this.runningRequests[requestId] = tracker;

                if (config.method === 'get' || config.method === 'delete') {
                        fetch(config.url, {
                            method: config.method,
                            headers: config.header
                        })
                        .then((response) => {
                            status = response.status;
                            return response.json()
                        })
                        .then((response) => {
                            this._handleResponse(response, status, tracker)
                        })
                        .catch(err => {
                            this._handleError(err, tracker)
                        })
                } else {
                        fetch(config.url, {
                            method: config.method,
                            headers: config.header,
                            body: JSON.stringify(config.data)
                        })
                        .then((response) => {
                            status = response.status;
                            return response.json()
                        })
                        .then((response) => {
                            this._handleResponse(response, status, tracker)
                        })
                        .catch(err => {
                            this._handleError(err, tracker)
                        })
                }
            }
    }

    _buildConfig = (url, data, method, successCallBack, errorCallBack) => {
        
            const config = {};

            const header = this._prepareHeader(data);

            if (data.clientId) {
            config.url = url;
            config.data = data;
            config.method = method;
            config.successCallBack = successCallBack;
            config.errorCallBack = errorCallBack;
            } else {
            config.url = url;
            config.header = header;
            config.data = data;
            config.method = method;
            config.successCallBack = successCallBack;
            config.errorCallBack = errorCallBack;
            }
            if (data.refreshToken) {
                config.noDelay = true;
            }
        
            return config;
    }

    _prepareHeader = (data) => {
        
            let headers;
            let basic;
            let Bearer;

            if (data.email && data.password) {
              basic = localStorage.getItem('uuid') + Environment.secrets.raffelSecret;
              const Basic = 'Basic ' + Base64.btoa(basic);
              headers = {'Authorization': Basic};
            } else if (data.refreshToken) {
              basic = localStorage.getItem('uuid') + Environment.secrets.raffelSecret;
              const Basic = 'Basic ' + Base64.btoa(basic);
              headers = {'Authorization': Basic};
            } else {
                Bearer = 'Bearer' + this.localStorageService.getValue('accessToken');
              headers = {'Authorization': Bearer};
            }
        
            return headers;

    }

    _post = (data, url, successCallBack, errorCallBack) => {
        const config = this._buildConfig(url, data, 'post', successCallBack, errorCallBack);
        this._fetch(config);
    }

    _get = ( url, successCallback, errorCallback) => {
        const config = this._buildConfig(url, '', 'get', successCallback, errorCallback);
        this._fetch(config);
    }

    _handleResponse = (response, status, tracker) => {
        let data = response;

        if (status >= 200 && status < 300) {
            delete this.runningRequests[tracker.requestId];
            if (data.status) {
              if (data.status.errorCode === 0) {
                tracker.config.successCallBack(data);
              } else {
                const err = data.status;
                tracker.config.errorCallBack(err);
              }
            } else {
                tracker.config.successCallBack(data);
            }
        } else {
            var utilityService = new UtilityService;
            const err = response;
            if (err && err.error_description) {
              let count = 0;
              for (const index in this.runningRequests) {
                if (true) {
                  count++;
                }
              }
              if ( err.error_description.indexOf('Access token expired') > -1 ) {
                    let userData = localStorage.getItem('user');
                    if (userData) {
                      userData = JSON.parse(userData);
                      userData['isAccessTokenExpired'] = Base64.btoa('1');
                      localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        this.localStorageService.setValue('isAccessTokenExpired', 1);
                    }
                    utilityService.handleError(err);
              }
              if (err.error_description.indexOf('Invalid access token') > -1 &&
                  this.localStorageService.getValue('isAccessTokenExpired') !== 1) {
                  utilityService.handleError(err);
              }
              if (err.error_description.indexOf('Access token expired') <= -1 &&
                  this.localStorageService.getValue('isAccessTokenExpired') !== 1 &&
                  err.error_description.indexOf('Invalid access token') < -1 ) {
                  delete this.runningRequests[tracker.requestId];
              }
              if (err.error_description.indexOf('Invalid refresh token (expired)') > -1) {
                  this.localStorageService.clearLocalStorage();
                  // utilityService.navigateToState(this._configuration.STATES.login);
              }
              if (err.error_description.indexOf('Access is denied') > -1) {
                  this._location.back();
              }
            }
            if (err.errorDescription === 'Could not open Hibernate Session for transaction; nested exception is org.hibernate.TransactionException: JDBC begin transaction failed: ') { 
                err.error_description = 'System seems to be under maintenance. Kindly contact your system administrator or try after sometime.';
              tracker.config.errorCallBack(err);
            } else {
                if(this.localStorageService.getValue('isAccessTokenExpired') != 1){
                    tracker.config.errorCallBack(err);
                }
            }
        }
    }
    
    _handleError = (err, tracker) => {
        tracker.config.errorCallBack(err);
    }

    lockRequest = () => {
        this.lockedForRefresh = true;
    }
    
    unLockRequestFlag = () => {
        this.lockedForRefresh = false;
        this.runningRequests = [];
        this.delayRequests = [];
    }

    unLockRequest = () => {
        this.lockedForRefresh = false;
        this.executeRunningRequests();
        this.executeDelayedRequests();
    }

    storeDelayedRequest = (config) => {
        const requestId = this.nextRequestId();
        const tracker = {
          requestId: requestId,
          config: config
        };
        this.delayRequests[requestId] = tracker;
    }

    nextRequestId = () => {
        return this.requestCounter += 1;
    }

    executeRunningRequests = () => {
        for (const key in this.runningRequests) {
          if (this.runningRequests.hasOwnProperty(key)) {
            this.executeRequests(this.runningRequests[key]);
            delete this.runningRequests[key];
          }
        }
    }
    
    executeDelayedRequests = () => {
        for (const key in this.delayRequests) {
          if (this.delayRequests.hasOwnProperty(key)) {
            this.executeRequests(this.delayRequests[key]);
            delete this.runningRequests[key];
          }
        }
    }
    
    executeRequests = (request) => {
        const config = this._buildConfig(
          request.config.url,
          request.config.data,
          request.config.method,
          request.config.successCallBack,
          request.config.errorCallBack);
        return this._fetch(config);
    }
}