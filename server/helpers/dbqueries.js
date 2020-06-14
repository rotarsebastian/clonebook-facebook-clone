const User = require(__dirname + '/../models/User');

// ====================== EDIT USER ======================
const editUser = async(form, id) => {
    try {
        // ====================== CREATE NEW UPDATE OBJ ======================
        let requestObj = {};
    
        // ====================== ADDING THE MODIFIED KEYS AND VALUES ======================
        form.map(prop => requestObj[prop.type] = prop.val);

        // ====================== AVOID CHANGING BIRTHDAY AND PASSWORD ======================
        if(requestObj.hasOwnProperty('birthdate') || requestObj.hasOwnProperty('password')) 
            return { status: 0, message: 'Birthdate or password cannot be updated!', code: 404 };

        // ====================== CHECK IF THE EMAIL IS NOT TAKEN ALREADY ======================
        if(requestObj.hasOwnProperty('email')) {
            const [ userExisting ] = await User.query().where({ email: requestObj.email }).limit(1);
            if(userExisting !== undefined && userExisting.id !== Number(id)) return { status: 0, message: 'This email is already taken!', code: 87 };
        }
    
        // ====================== MAKING REQUEST TO UPDATE IN THE DB ======================
        const dbResponse = await User.query().findById(id).patch(requestObj);
        if(!dbResponse) return { status: 0, message: 'DB Error! Please try again', code: 404 };

        // ====================== EVERYTHING OK ======================
        if(dbResponse === 1) return { status: 1, message: 'Your profile has been updated!', data: requestObj, code: 200 };
            else return { status: 0, message: 'DB Error! Please try again', code: 404 };
    
    // ====================== HANDLE ERROR ======================  
    } catch(e) {
        return { status: 0, message: 'Error configuring request!', code: 404 };
    }
}

module.exports = { editUser };