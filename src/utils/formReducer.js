const formReducer = (state , action) => {
    switch(action.type){
        case "HANDLE_INPUT_TEXT" :
            console.log(state , action.field , action.payload);
            return {
                ...state , [action.field] : action.payload,
            };
        default : 
        return state
    }
}

export default formReducer ;