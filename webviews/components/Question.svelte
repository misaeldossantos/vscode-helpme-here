<script lang="ts">
     import MdCloseIcon from "svelte-icons/md/MdClose.svelte";
     import StackoverflowService from "../core/StackoverflowService";
     import ActivityIndicator from "./ActivityIndicator.svelte";
     import Answer from "./Answer.svelte";

     export let question: any = null;
     export let opened = false;
     let loading: boolean = false;
     let answers: any = [];

     async function getAnswers() {
          try {
               loading = true
               const data = await StackoverflowService.getAnswers(question.question_id);
               answers = data.items;
          } catch (e) {
               console.log(e);
          } finally {
               loading = false
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
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          height: 100%;
          overflow: auto;
          transition: all 0.5s;
     }

     .content {
          border-top: 1px solid var(--vscode-foreground);
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          background-color: var(--vscode-editor-background);
          flex: 1;
          font-size: 12pt;
          line-height: 20px;
     }

     .header {
          display: flex;
          position: relative;
          padding-bottom: 20px;
     }

     .header .bg {
          background-color: var(--vscode-button-background);
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: -1000;
     }

     .header .title {
          font-size: 20pt;
          flex-wrap: wrap;
          display: flex;
          justify-self: flex-end;
          line-height: 30px;
     }

     .header-content {
          width: 100%;
          padding: 20px;
     }

     .close-icon {
          justify-self: flex-end;
          align-self: flex-end;
          flex-direction: row;
          display: flex;
          cursor: pointer;
     }

     .close-icon {
          height: 20px;
          width: 20px;
          color: var(--vscode-button-background);
          background-color: white;
          border-radius: 50%;
          transition: opacity 0.5s;
     }

     .close-icon:hover {
          opacity: 0.5;
     }

     .no-answers {
          text-align: center;
          padding: 20px;
          display: flex;
          align-self: center;
          justify-self: center;
     }

     .opened {
          transform: translateX(0);
     }

     .closed {
          transform: translateX(100%);
     }
</style>

<div class="container" class:opened class:closed={!opened}>
     <div class="header">
          <div class="bg" />
          <div class="header-content flex-col gap-y-10 flex">
               <div class="close-icon" on:click={() => (opened = false)}>
                    <MdCloseIcon />
               </div>
               <span class="title"> {@html question && question.title} </span>
               <a href={question?.link}>
                    Open on StackOverflow
                </a>
          </div>
     </div>

     <div class="content">
          {#if loading}
               <ActivityIndicator />
          {:else if question}
               {#if !answers.length}
                    <h3 class="no-answers">
                         No answers found for this question
                    </h3>
               {:else}
                    {#each answers as answer}
                         <Answer {answer} />
                    {/each}
               {/if}
          {/if}
     </div>
</div>
