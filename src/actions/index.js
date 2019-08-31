import {
    CHANGE_ACTIVE_TAB,
    CHANGE_HEADER_TITLE,
    OPEN_MENU,
    CLOSE_MENU,
    BACK_BUTTON,
    LOADER
} from '../actions/actionTypes'

export const tabActiveAction = value => {
    return dispatch => {
        dispatch({ type: CHANGE_ACTIVE_TAB, tabActive: value })
    }
}

export const headerTitleAction = value => {
    return dispatch => {
        dispatch({ type: CHANGE_HEADER_TITLE, headerTitle: value })
    }
}

export const openMenuAction = () => {
    return dispatch => {
        dispatch({ type: OPEN_MENU })
    }
}

export const closeMenuAction = () => {
    return dispatch => {
        dispatch({ type: CLOSE_MENU })
    }
}

export const backButtonAction = value => {
    return dispatch => {
        dispatch({ type: BACK_BUTTON, backButton: value })
    }
}

export const loaderAction = value => {
    return dispatch => {
        dispatch({ type: LOADER, loader: value })
    }
}