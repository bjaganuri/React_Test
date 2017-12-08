import {call, put} from 'redux-saga/effects';
import { actions } from "react-redux-form";

export function* ResetForm(action) {
	yield put(actions.reset(action.payload.modelname));
}