<script>
    import IconUser from '../MiniComponents/IconUser.svelte';
    import ProfileImg from './../MiniComponents/ProfileImage.svelte';
    import { store } from '../../stores/store.js';    
    import { getConversation } from '../../helpers/conversations.js';    

    let messagesBox, messageInputValue = '', loaded = 0;

    let conversation = undefined, inputRef;
    $: conversation = $store.assignNewMessage 
        ? 
        { ...conversation, messages: [ ...conversation.messages, { ...$store.assignNewMessage } ] } 
        : conversation, 
        updateConversation()

    const getMessages = async() => {
        const result = await getConversation($store.chatUserStore.friend_id, 0, $store.accessToken);
        conversation = result.data;
        loaded += result.data.messages.length;
        setTimeout(() => { 
            if(messagesBox) {
                messagesBox.scrollTop = messagesBox.scrollHeight;
                inputRef.focus();
                messagesBox.addEventListener('scroll', () => {
                    if(messagesBox.scrollTop === 0) showMoreMessages();
                });
            }
        }, 100);
    }

    const showMoreMessages = async() => {
        const result = await getConversation($store.chatUserStore.friend_id, loaded + 20, $store.accessToken);
        if(result.data.messages[0].date !== conversation.messages[0].date) {
            conversation.messages = [ ...result.data.messages, ...conversation.messages ];
            conversation.messages = conversation.messages.filter((v,i,a)=>a.findIndex(t=>(t.date === v.date))===i);
            loaded += result.data.messages.length;
        }
    }   

    const updateConversation = () => {
        setTimeout(() => { 
            if(messagesBox && $store.assignNewMessage !== null) messagesBox.scrollTop = messagesBox.scrollHeight;
            $store.assignNewMessage = null;
        }, 100);
    }

    const handleSendMessage = async() => {
        if(messageInputValue.length > 0) {
            const newMessage = { 
                from: $store.user._id, 
                to: $store.chatUserStore.friend_id, 
                text: messageInputValue.trim(),
                from_user_first_name: $store.user.first_name,
                from_user_image: $store.user.images[0] 
            };
            $store.socket.emit('sendMessage', newMessage );

            conversation.messages = [ ...conversation.messages, { from: $store.user._id, text: messageInputValue.trim(), date: new Date() } ];
            messageInputValue = '';
            setTimeout(() => messagesBox ? messagesBox.scrollTop = messagesBox.scrollHeight : false, 100);
        }
    }

    const messagesData = getMessages($store.chatUserStore);
</script>

<!-- ######################################## -->
{#await messagesData}
    <div>...waiting</div>
{:then data}
    {#if $store.chatUserStore}
        <div class="chatContainer">
            <div class="topBar">
                <IconUser user={$store.chatUserStore} click={true} />
                <div class="closeChatContainer" on:click={() => { $store.chatUserStore = null; $store.assignNewMessage = null; }}>
                    <span class="closeChatButton"></span>
                </div>
            </div>

            <div class="chatMessagesContainer" bind:this={messagesBox}>
                <div class="chatMessages"> 
                    {#if conversation}
                        {#each conversation.messages as message, index}
                            <div 
                                class={`message ${message.from === $store.user._id ? 'right' : 'left'}`} 
                                class:closeup={conversation.messages[index + 1] && conversation.messages[index + 1].from === message.from}
                                class:roundTop={(conversation.messages[index - 1] && conversation.messages[index - 1].from !== message.from)|| conversation.messages.indexOf(message) === 0}
                                class:round={conversation.messages[index - 1] && conversation.messages[index - 1].from === message.from}
                                class:roundBottom={(conversation.messages[index + 1] && conversation.messages[index + 1].from !== message.from) || conversation.messages.indexOf(message) === conversation.messages.length - 1}
                            >
                                <div>
                                    {#if message.from !== $store.user._id && (conversation.messages[index + 1] && conversation.messages[index + 1].from !== message.from || conversation.messages.indexOf(message) === conversation.messages.length - 1)}
                                        <span class="profileImg">
                                            <ProfileImg 
                                                size={1.85} 
                                                img={$store.chatUserStore.image} 
                                                slideShowImgs={[ $store.chatUserStore.image ]} 
                                            />
                                        </span>
                                    {/if}
                                    <!-- <p class={"meta"}><span>{message.time}</span></p> -->
                                    <span class={"text"}>{message.text}</span>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
            <div class="chatIsTyping">{$store.chatUserStore.name.split(' ')[0]} is typing...</div>

            <div class="formContainer">
                <form on:submit|preventDefault={handleSendMessage}>
                    <input 
                        type="text" 
                        placeholder="Enter message" 
                        bind:value={messageInputValue} 
                        bind:this={inputRef} 
                    />
                </form>
                <span on:click={handleSendMessage}></span>
            </div>

        </div>
    {/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<!-- ######################################## -->

<style>
    .formContainer {
        position: absolute;
        bottom: 0;
        padding: .5rem;
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    .formContainer input {
        background-color: #e4e6eb;
        padding: .5rem .8rem;
    }
    .formContainer input::placeholder {
        font-size: .85rem;
        letter-spacing: .3px;
        color: rgb(150, 150, 150);
        font-weight: 200;
    }

    .formContainer form {
        width: 89%;
    }

    .formContainer span {
        margin-left: .5rem;
        cursor: pointer;
        filter: invert(33%) sepia(50%) saturate(3607%) hue-rotate(203deg) brightness(99%) contrast(91%);
        width: 1.3rem;
        height: 1.3rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='sqpo3gyd' height='20px' width='20px' viewBox='0 0 24 24'%3E%3Cpath d='M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z' fill-rule='evenodd' stroke='none'%3E%3C/path%3E%3C/svg%3E");
    }

    .chatMessagesContainer {
        padding: .95rem;
        height: 21rem;
        font-size: 1rem;
        overflow-y: scroll;
    }

    .chatIsTyping {
        font-style: italic;
        color: var(--grey);
        font-size: .8rem;
        letter-spacing: .2px;
        margin: .52rem .7rem;
    }

    .message {
        display: flex;
        margin-bottom: .65rem;
        margin-left: 2rem;
        position: relative;
    }

    .message .profileImg {
        display: flex;
        position: absolute;
        left: -2.5rem;
        bottom: 0;
    }

    .message.right {
        justify-content: flex-end;
    }

    .message .text {
        display: flex;
        width: fit-content;
        background-color: var(--blue);
        color: #fff;
        padding: .35rem .7rem;
        border-radius: 15px;
        font-family: system-ui, -apple-system, system-ui, ".SFNSText-Regular", sans-serif;
        font-size: 15px;
        line-height: 19.9995px;
        overflow-wrap: break-word;
        text-align: start;
        unicode-bidi: isolate;
        white-space: pre-wrap;
        word-break: break-word;
        -webkit-font-smoothing: antialiased;
        max-width: 13.5rem;
    }

    .message.left .text {
        background-color: #e4e6eb;
        color: var(--black);
        font-weight: 400;
    }

    .message.closeup {
        margin-bottom: .1rem; 
    }

    .message.right.closeup .text {
        border-bottom-right-radius: 3px;
        border-top-right-radius: 3px;
    }

    .message.left.closeup .text {
        border-bottom-left-radius: 3px;
        border-top-left-radius: 3px;
    }

    .message.right.roundBottom .text {
        border-bottom-right-radius: 15px;
    }

    .message.right.roundTop .text {
        border-top-right-radius: 15px;
    }

    .message.right.round .text {
        border-top-right-radius: 3px;
    }

    .message.left.roundBottom .text {
        border-bottom-left-radius: 15px;
    }

    .message.left.roundTop .text {
        border-top-left-radius: 15px;
    }

    .message.left.round .text {
        border-top-left-radius: 3px;
    }

    .chatContainer {
        position: fixed;
        bottom: 2vh;
        right: 5vh;
        background: #fff;
        width: 328px;
        height: 455px;
        border-radius: 8px;
        box-shadow:rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
    }

    .chatContainer .topBar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 2rem;
        transition: .3s;
        padding: 1.5rem .5rem;
        cursor: pointer;
        position: relative;
        box-shadow: 0 0 10px 0 #eee;
    }

    .chatContainer .topBar .closeChatContainer { 
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

    .chatContainer .topBar .closeChatContainer:hover {
        background: rgb(218, 218, 218);
    }

    .chatContainer .topBar .closeChatButton {
        width: 9px;
        height: 9px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3C!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='357px' height='357px' viewBox='0 0 357 357' style='enable-background:new 0 0 357 357;' xml:space='preserve'%3E%3Cg%3E%3Cg id='close'%3E%3Cpolygon points='357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5 '/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E%0A");
    }   
</style>