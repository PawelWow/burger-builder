import { put, call, delay } from "redux-saga/effects";
import axios from "axios";

import * as actions from "../actions/index";
import * as secrets from "../../secrets";

// Indexy itemów prechowywanych w localStorage
const IDS_TOKEN = 'token';
const IDS_EXPIRATION_DATE = 'expirationDate';
const IDS_USER_ID = 'userId';

export function* logoutSaga(action) {
    // call umożłiwia mockowanie, czyli jest lepsze pod tym względem niż localStorage.removeItem("item"), bo nie musi zapisac w storag'u

    yield call([localStorage, "removeItem"], IDS_TOKEN);
    yield call([localStorage, "removeItem"], IDS_EXPIRATION_DATE);
    yield call([localStorage, "removeItem"], IDS_USER_ID);

    // yield localStorage.removeItem(IDS_TOKEN);
    // yield localStorage.removeItem(IDS_EXPIRATION_DATE);
    // yield localStorage.removeItem(IDS_USER_ID);
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };

    const url = getSignupEndpoint(action.isSignup);

    try {

        const response = yield axios.post(url, authData);

        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        yield localStorage.setItem(IDS_EXPIRATION_DATE, expirationDate);
        yield localStorage.setItem(IDS_TOKEN, response.data.idToken);                
        yield localStorage.setItem(IDS_USER_ID, response.data.localId);

        yield put (
            actions.authSuccess(response.data.idToken, response.data.localId)
        );
        yield put (actions.checkAuthTimeout(response.data.expiresIn));
    } catch( error ) {
        yield put(actions.authFail(error.response.data.error));
    }
}

export function* authCheckStateSaga(action) {

    const token = yield localStorage.getItem(IDS_TOKEN);
    if(!token) {
        yield put(actions.logout());
        return;
    }

    const expirationDate = yield new Date(localStorage.getItem(IDS_EXPIRATION_DATE));
    if(expirationDate <= new Date())  {
        yield put(actions.logout());
        return;
    }

    const userId = yield localStorage.getItem(IDS_USER_ID);
    yield put(actions.authSuccess(token, userId));
    yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 )); 
}

// Api key można by gdzieś szyfrować...
const getSignupEndpoint = (isSignup) => {
    if(isSignup){
        return 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + secrets.API_SECRET_KEY;
    } else {
        return 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + secrets.API_SECRET_KEY;
    }
};

