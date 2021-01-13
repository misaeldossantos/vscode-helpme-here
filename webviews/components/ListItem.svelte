<script type="ts">
     import { createEventDispatcher } from "svelte";
     import MdLinkIcon from "svelte-icons/md/MdLink.svelte";
     import MdChatIcon from "svelte-icons/md/MdChat.svelte";

     const dispatch = createEventDispatcher();
     export let item;

     function openModal() {
          dispatch("openModal", item);
     }
</script>

<style>
     .container {
          cursor: pointer;
          margin-bottom: 5px;
          background-color: var(--vscode-list-focusBackground);
          border: 1px solid var(--vscode-z);
     }

     .container:hover {
          background-color: var(--vscode-list-hoverBackground);
     }

     .content:hover {
          opacity: 0.8;
     }

     .content {
          padding: 10px;
     }

     .footer {
          padding: 10px;
          border-top: 1px solid grey;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
     }

     .link-icon, .md-chat-icon {
          height: 20px;
          width: 20px;
          color: var(--vscode-textLink-foreground);
          transition: transform 0.5s;
     }

     .md-chat-icon {
          color: white;
     }

     .link-icon:hover {
          color: var(--vscode-textLink-activeForeground);
          transform: scale(1.2);
     }

     .answers-container {
          display: flex;
          flex-direction: row;
          align-items: center;
     }
</style>

<div class="container">
     <p
          class="content"
          on:click={() => {
               openModal();
          }}>
          {@html item.title}
     </p>
     <div class="footer">
          <div class="answers-container">
               <div class="md-chat-icon" style="margin-right: 10px;">
                    <MdChatIcon />
               </div>
               <span>{item.answer_count}</span>
          </div>
          <a href={item.link} class="link-icon">
               <MdLinkIcon />
          </a>
     </div>
</div>
