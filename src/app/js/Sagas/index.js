import { takeLatest } from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { GetSessionInfo, Signin, Signup, SetPwdRecoverUser, SetPwdResetPwd } from './UserAuthentication';
import { ResetForm } from './common';

export function* sagas() {
  yield [
	fork(takeLatest, 'getSessionData', GetSessionInfo),
    fork(takeLatest, 'usersSignin', Signin),
    fork(takeLatest, 'usersSignup', Signup),
    fork(takeLatest, 'usersSetPwdRecoverUser', SetPwdRecoverUser),
	fork(takeLatest, 'usersSetPwdResetPwd', SetPwdResetPwd),
	fork(takeLatest, 'resetForm', ResetForm)
  ];
}
