<script>
    import { validateForm } from './../helpers/validation';
    import { showNotification } from './../helpers/actionNotifications';
    import Icon from 'svelte-awesome';
    import { store } from './../stores/store.js';
    import { spinner } from 'svelte-awesome/icons';
    import { changePassword } from './../helpers/user';
    import { goto } from '@sveltech/routify';

    // ====================== PROPS ======================
    export let goBack;

    // ====================== DYNAMIC VARIABLES ======================
    let newPassword = '', repeatNewPassword = '', buttonLoading = false;;

    const handleChangePass = async() => {

        // ====================== VALIDATION ======================
        const changePassData = [ 
            { type: 'password', val: newPassword }, 
            { type: 'password', val: repeatNewPassword },
        ];

        const isFormValid = validateForm(changePassData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        if($store.user.changeKey) changePassData.push({ key: $store.user.changeKey });
            else return showNotification('danger', 'Unauthorized!');

        // ====================== REQUEST ======================
        buttonLoading = true;
        const res = await changePassword(changePassData);
        $store.user.changeKey = undefined;
        buttonLoading = false;

        // ====================== RESPONSE ======================
        if(res.status === 1) {
            goBack();
            return showNotification('success', 'Your password has been changed!');
        } else return showNotification('danger', res.message);
    }

</script>

<div class="changePassContainer">
    <h1>Change your password</h1>
    <div class="text">Just insert your new password.</div>
    <form class="recoverForm" on:submit|preventDefault={handleChangePass}>

        <div class="inputContainer">
            <input class="input" name="password" type="password" placeholder="New password" bind:value={newPassword} />
        </div>

        <div class="inputContainer">
            <input class="input" name="repeatPassword" type="password" placeholder="Repeat new password" bind:value={repeatNewPassword} />
        </div>

        <button class="changePassButton" disabled={!newPassword || !repeatNewPassword} type="submit">Change password</button>
    </form>
</div>

<style>
    .changePassContainer h1 {
        color: rgb(51, 51, 51);
        font-size: 36px;
        font-family: 'Freight Medium';
        line-height: 43.2px;
        margin-bottom: 5px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .changePassContainer .text {
        color: rgb(51, 51, 51);
        font-family: 'Freight Light';
        font-size: 19px;
        line-height: 23.94px;
        margin-bottom: 20px;
        overflow-wrap: break-word;
        text-rendering: optimizelegibility;
        -webkit-font-smoothing: subpixel-antialiased;
    }

    .changePassContainer {
        background-color: #e9ebee;
        margin-top: 5.25rem;
        height: calc(100vh - 5.25rem);
        padding-top: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .changePassButton {
        margin: 0 auto;
        background-color: rgb(105, 167, 78);
        background-image:linear-gradient(rgb(103, 174, 85), rgb(87, 136, 67));
        box-shadow:rgb(164, 227, 136) 0px 1px 1px 0px inset;
        color: #fff;
        font-size: 19px;
        font-family: 'Freight Medium';
        text-rendering: optimizelegibility;
        cursor: pointer;
        text-shadow: 0 1px 2px rgba(0,0,0,.5);
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 7px 20px;
        min-width: 194px;
        text-align: center;
        border-radius: 5px;
        width: 15%;
        transition: .3s;
        outline: none;
    }

    .changePassButton:disabled {
        filter: brightness(1.1);
        opacity: .7;
    }
  
    .recoverForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .recoverForm .input {
        width: 100%;
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid rgb(189, 199, 216);
        color: rgb(28, 30, 33);
        font-size: 17px;
        overflow-wrap: break-word;
        padding: 8px 10px;
        margin-bottom: .5rem;
        width: 25vw;
    }

    .recoverForm .input::placeholder {
        font-size: 18px;
        color: rgb(150, 150, 150);
        font-weight: 400;
    }

    .recoverForm .nameContainer input {
        width: 50%;
    }

    .recoverForm .nameContainer input:first-of-type {
        margin-right: .25rem;
    }

    .recoverForm .nameContainer input:last-of-type {
        margin-left: .25rem;
    }

    .recoverForm .inputContainer {
        color: #333;
        width: 100%;
    }
</style>