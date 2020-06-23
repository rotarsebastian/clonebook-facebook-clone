<script>
    import Register from './../components/Register.svelte';
    import ForgotPass from './../components/ForgotPass.svelte';
    import ChangePass from './../components/ChangePass.svelte';
    import { validateForm } from './../helpers/validation';
    import { store } from './../stores/store';
    import { goto } from '@sveltech/routify';
    import { showNotification } from './../helpers/actionNotifications';
    import Icon from 'svelte-awesome';
    import { spinner } from 'svelte-awesome/icons';
    import { login } from './../helpers/user';
    import { isUuid } from 'uuidv4';

    // ====================== DYNAMIC VARIABLES ======================
    let loginPass = '123123', loginEmail = 'rotar.seby1@gmail.com',
        showForgotPass = false, showChangePass = false, buttonLoading = false;

    // ====================== CONSTANT VARIABLES ======================
    const searchParams = new URLSearchParams(location.search),
        key = searchParams.get('key'),
        activatedKey = searchParams.get('activated'),
        isExpired = searchParams.get('expired'); 

    // ====================== LINK TO CHANGE PASS EXPIRED ======================
    if(isExpired && isExpired === 'true') {
        showNotification('warning', 'Your link has expired!');
        $goto('login');
    }

    // ====================== ACCOUNT IS VERIFIED AND ACTIVATED ======================
    else if(activatedKey && isUuid(activatedKey)) {
        showNotification('success', 'Your account is now activated!');
        $goto('login');
    }

    // ====================== LINK TO CHANGE PASS ACCEPTED - SWITCH TO CHANGE PASS ======================
    else if(key && isUuid(key)) {
        $store.user.changeKey = key;
        $goto('login');
        showChangePass = true;
    }

    // ====================== LOGIN USER ======================
    const handleLogin = async() => {

        // ====================== VALIDATION ======================
        const loginData = [ 
            { type: 'email', val: loginEmail }, 
            { type: 'password', val: loginPass }
        ];

        const isFormValid = validateForm(loginData);
        if(!isFormValid.formIsValid) return showNotification('danger', `Invalid ${isFormValid.invalids.join(', ')}`);

        // ====================== REQUEST ======================
        buttonLoading = true;
        const res = await login(loginData);
        buttonLoading = false;

        // ====================== RESPONSE ======================
        if(res.status === 1) {
            $store.isAuthenticated = true;
            $store.user = res.loggedUser;
            $store.accessToken = res.accessToken;
            localStorage.setItem('refreshToken', res.refreshToken);
            $goto('home');
            return showNotification('success', 'You are now logged in!');
        } else return showNotification('danger', res.message);
    }

    // ====================== GET BACK TO LOGIN ======================
    const goBack = () => showChangePass = false;

</script>

<!-- BLUE TOP BAR -->
<nav>
    <span style="cursor: pointer;" class="logo" on:click={() => showForgotPass = false}></span>

    <form class="loginForm" on:submit|preventDefault={handleLogin}>

        <div class="inputContainer">
            <label for="email">Email</label>
            <input name="email" type="text" bind:value={loginEmail} />
        </div>

        <div class="inputContainer">
            <label for="password">Password</label>
            <input name="password" type="password" bind:value={loginPass} />
            <span class="forgotPass" on:click={() => showForgotPass = true}>Forgotten account?</span>
        </div>

        <button disabled={!loginEmail || !loginPass} type="submit" class="loginButton">
            {#if buttonLoading}
                <Icon class="spinner" scale={0.75} data={spinner} pulse />
                {:else}
                Log In
            {/if}
        </button>
    </form>
</nav>

<!-- PAGE UNDER TOP BAR -->
{#if showForgotPass}
    <ForgotPass />
    {:else if showChangePass}
    <ChangePass goBack={goBack} />
    {:else}
    <Register />
{/if}

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 5.25rem;
        padding: 0 1vw; 
        background-color: #3b5998;
        background-image: linear-gradient(#4e69a2, #3b5998 50%);
        border-bottom: 1px solid #133783;
        min-height: 42px;
        color: #000;
        box-shadow: 0 0 10px 0 #dcdcdc;
        z-index: 1;
        padding: 0 6rem;
    }

    nav .logo {
        background-image: url('https://static.xx.fbcdn.net/rsrc.php/v3/y4/r/gf6iHxsw8zm.png');
        background-position: 0 0;
        background-size: 100% 100%;
        width: 170px;
        height: 33px;
    }

    .loginForm {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loginForm .loginButton {
        background-color: rgb(66, 103, 178);
        color: #fff;
        border: 1px solid rgb(41, 72, 125);
        font-size: 12px;
        font-weight: 400;
        padding: .25rem .5rem;
        cursor: pointer;
        margin-left: .8rem;
        outline: none;
        transition: .3s;
        margin-top: .35rem;
        width: 4rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loginForm .loginButton:hover {
        background-color: #365899;
        border-color: #29487d;
    }

    .loginForm .inputContainer {
        color: #fff;
        height: 4.3rem;
        width: 10rem;
    }

    .loginForm .inputContainer:first-of-type {
        margin-right: 1rem;
    }

    .loginForm .inputContainer label {
        font-size: 12px;
        font-weight: 400;
    }

    .loginForm .inputContainer input {
        border-radius: 0;
        height: 1.25rem;
        padding: 4px;
    }

    .loginForm .inputContainer .forgotPass {
        color: #9cb4d8;
        font-size: 12px;
        cursor: pointer;
        transition: .3s;
    }

    .loginForm .inputContainer .forgotPass:hover {
        text-decoration: underline;
    }
</style>

