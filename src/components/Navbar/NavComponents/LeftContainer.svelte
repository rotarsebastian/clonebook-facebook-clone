<script>
    import IconUser from '../../MiniComponents/IconUser.svelte';
    import { url } from '@sveltech/routify';
    import { searchUsers } from './../../../helpers/auth.js';
    import { store } from './../../../stores/store.js';
    import { goto } from '@sveltech/routify';

    let ajUsers = [];
    let showingResults = false;
    let searchInput;

    const getSearchData = async() => {
        const { value: search } = searchInput;
        if(search.length > 1) {
            ajUsers = [];
            const response = await searchUsers(search, $store.accessToken);
            ajUsers = response.data;
            showingResults = true;
        } else ajUsers = [];
    }

    const handleClickSearch = e => {
        e.stopPropagation();
        showingResults = true;
    }

    const handleRedirect = id => {
        $goto(`./profile/${id}`);
        // $goto('./profile', { id });
        showingResults = false;
        ajUsers = [];
        searchInput.value = '';
    }

    window.addEventListener('click', () => {
        if(showingResults === true) showingResults = false;
    })
</script>

<!-- ######################################## -->

<div class="leftContainer">
    <a href={$url('./home')}><img src="./assets/imgs/facebook.svg" class="logo" alt="logo" /></a>
    <div id="searchContainer">
        <form>
            <div class="inputContainer" on:click={handleClickSearch}>
                <img class="searchIcon" class:open={showingResults} on:click={handleClickSearch} src="https://static.xx.fbcdn.net/rsrc.php/v3/yt/r/LZP5SAAuvu9.png" alt="logo" height="16" width="16" />
                <input type="text" 
                    class:open={showingResults}
                    on:input={getSearchData}
                    bind:this={searchInput} 
                    placeholder="Search Facebook"
                    on:click={handleClickSearch} 
                />
            </div>
        </form>
        {#if showingResults}
            <div id="searchResults" class="animated fast fadeIn" on:click={e => e.stopPropagation()}>
                <div class="backArrowContainer" on:click={() => showingResults = false }>
                    <span class="backArrow"></span>
                </div>
                <div class="resultsContainer">
                    <div class="recentSearchContainer">{ajUsers.length > 0 ? 'Users' : ''}</div>
                    <div class="results">
                        {#each ajUsers as ajUser}
                            <div class="searchResultUser" on:click={() => handleRedirect(ajUser._id)}>
                                <IconUser user={ajUser} />
                                <div class="deleteSearchContainer">
                                    <span class="deleteSearchButton" on:click={() => ajUsers = ajUsers.filter(user => user !== ajUser)}></span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- ######################################## -->

<style>
    .leftContainer {
        display: flex;
        align-items: center;
        width: 20rem;
    }

    .leftContainer img.logo {
        width: 2.5rem;
        height: 2.5rem;
        cursor: pointer;
        background-repeat: no-repeat;
        filter: invert(33%) sepia(89%) saturate(2653%) hue-rotate(203deg) brightness(98%) contrast(93%);
    }

    .leftContainer img.logo:hover {
        opacity: .8;
    }

    .leftContainer #searchContainer form .inputContainer {
        margin-left: .5rem;
        position: relative;
        z-index: 3;
    }

    .leftContainer #searchContainer form .inputContainer .searchIcon {
        filter: invert(0.39) sepia(0.21) saturate(2) saturate(1.095) hue-rotate(174deg) brightness(0.94) contrast(0.86);
        position: absolute;
        top: 50%;
        left: 8%;
        transform: translate(-50%, -50%);
    }

    .leftContainer #searchContainer form .inputContainer input {
        background-color: var(--light-grey);
        color: var(--black);
        padding: 0 1rem;
        padding-top: .4rem;
        padding-bottom: .5rem;
        height: 2.5rem;
        outline: none;
        border: none;
        text-indent: 1.25rem;
        width: 15rem;
        font-size: 0.925rem;
    }

    .leftContainer #searchContainer {
        position: relative;
    }

    .leftContainer #searchResults .backArrowContainer {
        top: 0.2rem;
        left: .95rem;
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        background: #fff;
        margin-right: 10px;
        border-radius: 50%;
        transition: .4s;
        cursor: pointer;
    }

    .leftContainer #searchResults .backArrowContainer:hover {
        background: var(--light-grey);
    }

    .leftContainer #searchResults .backArrowContainer .backArrow {
        width: 15px;
        height: 15px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 19.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 31.494 31.494' style='enable-background:new 0 0 31.494 31.494;' xml:space='preserve'%3E%3Cpath style='fill:%231E201D;' d='M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554 c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z'/%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }

    .leftContainer #searchContainer #searchResults {
        opacity: 0;
        position: absolute;
        width: 130%;
        background: #fff;
        color: var(--black);
        padding: .2rem;
        max-height: 38vh;
        padding-top: 0.75rem; 
        top: -.7rem;
        left: -3.6rem;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 12px 0px, rgba(255, 255, 255, 0.5) 0px 0px 0px 0px inset;
        z-index: 2;
        border-bottom-right-radius: 8px;
        overflow: hidden;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer {
        margin: .4rem 0.45rem;
        margin-left: .85rem;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .recentSearchContainer {
        margin-left: .75rem;
        margin-top: 1.5rem;
        color: rgb(5, 5, 5);
        font-size: 17px;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results {
        margin-top: 1rem;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results .searchResultUser {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 2rem;
        transition: .3s;
        border-radius: 10px;
        padding: 1.5rem .5rem;
        position: relative;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results .searchResultUser:hover {
        background: #eee;
        cursor: pointer;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results .searchResultUser .deleteSearchContainer { 
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        border-radius: 50%;
        transition: .4s;
        cursor: pointer;
        padding: 9px;
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results .searchResultUser .deleteSearchContainer:hover {
        background: rgb(218, 218, 218);
    }

    .leftContainer #searchContainer #searchResults .resultsContainer .results .searchResultUser .deleteSearchButton {
        width: 9px;
        height: 9px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='357px' height='357px' viewBox='0 0 357 357' style='enable-background:new 0 0 357 357;' xml:space='preserve'%3E%3Cg%3E%3Cg id='close'%3E%3Cpolygon points='357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 '/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }   

    @media only screen and (max-width: 1260px) {
        .leftContainer #searchContainer form .inputContainer input {
            width: 2.5rem;
            cursor: pointer;
        }

        .leftContainer #searchContainer form .inputContainer input.open {
            width: 15rem;
            cursor: text;
        }

        .leftContainer #searchContainer form .inputContainer .searchIcon {
            left: 50%;
            cursor: pointer;
        }

        .leftContainer #searchContainer form .inputContainer .searchIcon.open {
            left: 8%;
            cursor: text;
        }
    }

</style>