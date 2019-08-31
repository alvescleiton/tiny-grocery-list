import {
    CHANGE_ACTIVE_TAB,
    CHANGE_HEADER_TITLE,
    OPEN_MENU,
    CLOSE_MENU,
    BACK_BUTTON,
    LOADER
} from '../actions/actionTypes'

const initialState = {
    loader: false,
    tabActive: 'lista_atual',
    headerTitle: 'Lista Atual',
    menuOpened: false,
    backButton: false
}

export const generalLayoutReducer = (state = initialState, action) => {
    switch(action.type) {
        case CHANGE_ACTIVE_TAB:
            return {
                ...state,
                tabActive: action.tabActive
            }
        case CHANGE_HEADER_TITLE:
            return {
                ...state,
                headerTitle: action.headerTitle
            }
        case OPEN_MENU:
            return {
                ...state,
                menuOpened: true
            }
        case CLOSE_MENU:
            return {
                ...state,
                menuOpened: false
            }
        case BACK_BUTTON:
            return {
                ...state,
                backButton: action.backButton
            }
        case LOADER:
            return {
                ...state,
                loader: action.loader
            }
        default:
            return state
    }
}