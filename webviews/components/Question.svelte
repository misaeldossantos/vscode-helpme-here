<script lang="ts">
     import axios from "axios";
     import MdCloseIcon from "svelte-icons/md/MdClose.svelte";

     export let question: any = null;
     export let opened = false;
     let answers: any = [];

     async function getAnswers() {
          try {
               const { data } = await axios.get(
                    `https://api.stackexchange.com/2.2/questions/${question.question_id}/answers`,
                    {
                         params: {
                              order: "desc",
                              sort: "activity",
                              filter: "!--1nZy5L4.V1",
                              site: "stackoverflow",
                         },
                    }
               );
               answers = data.items;
          } catch (e) {
               console.log(e);
          } finally {
          }
     }

     $: if (question) {
          getAnswers();
     }
</script>

<style>
     .container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          overflow: auto;
     }

     .content {
          display: flex;
          flex-wrap: nowrap;
          flex-direction: column;
          background-color: var(--vscode-input-background);
          padding: 20px;
          flex: 1;
          font-size: 12pt;
          line-height: 20px;
     }

     .header {
          height: 200px;
          display: flex;
          position: relative;
     }

     .header .bg {
          background-color: rgba(0, 0, 0, 0.8);
          filter: blur(8px);
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: -1000;
     }

     .header .title {
          font-size: 20pt;
          padding: 10px;
          justify-self: flex-end;
     }

     .header-content {
          display: flex;
          flex-direction: column;
     }
     
     .header-content .close-icon {
          justify-content: flex-end;
          flex-direction: column;
          display: flex;
          cursor: pointer;
     }

     .close-icon {
          height: 20px;
          width: 20px;
     }

</style>

{#if opened}
     <div class="container">
          <div class="header">
               <div class="bg" />
               <div class="header-content">
                    <div class="close-icon" on:click={() => opened = false}>
                         <MdCloseIcon />
                    </div>
                    <span class="title"> {question.title} </span>
               </div>
          </div>

          <div class="content">
               {#if question}
                    {#each answers as answer}
                         <div>
                              {@html answer['body']}
                         </div>
                    {/each}
               {/if}
          </div>
     </div>
{/if}
