import request from '../../../core/request.js';
import api from '../../../core/appOnLaunch.js';

export default {
    getAward(status,day) {
        return new Promise((resolve, reject) => {
            request({
                url: api.check_in.sign_in,
                data: {
                    status: status,
                    day: day ? day : 1
                }
            }).then(response=>{
                if(response.code == 0) {
                    this.checkInResult(response.data.queueId, response.data.token).then(result => {
                        return resolve(result);
                    }).catch(e => {
                        return reject(e);
                    });
                }else {
                    return reject(response.msg);
                }
            }).catch(response => {
                return reject(response);
            });
        });
    },
    checkInResult(queueId, token) {
        return new Promise((resolve, reject) => {
            request({
                url: api.check_in.sign_in_result,
                data: {
                    queueId: queueId,
                    token: token
                }
            }).then(response=>{
                if(response.code == 0) {
                    if (response.data.retry == 1) {
                        this.checkInResult(queueId, token).then(result => {
                            return resolve(result);
                        }).catch(e => {
                            return reject(e);
                        });
                    } else {
                        return resolve(response.data);
                    }
                }else {
                    return reject(response.msg);
                }
            }).catch(response => {
                return reject(response);
            });
        });
    },
}