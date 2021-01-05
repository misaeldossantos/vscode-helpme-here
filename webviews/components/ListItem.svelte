<script type="ts">
     import { createEventDispatcher } from "svelte";
     import MdLinkIcon from 'svelte-icons/md/MdLink.svelte'

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
          background-color: var(--vscode-input-background);
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
          justify-content: flex-end;
     }

     .link-icon {
          height: 20px;
          width: 20px;
          color: var(--vscode-textLink-foreground);
          transition: transform 0.5s;
     }

     .link-icon:hover {
          color: var(--vscode-textLink-activeForeground);
          transform: scale(1.2);
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
          <div class="link-icon">
               <MdLinkIcon />
          </div>
     </div>
</div>
