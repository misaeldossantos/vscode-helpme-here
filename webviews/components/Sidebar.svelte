<script context="module" lang="ts">
    declare var acquireVsCodeApi: any;
    const vscode = acquireVsCodeApi();
</script>

<script lang="ts">
    import axios from "axios";
    import ActivityIndicator from "./ActivityIndicator.svelte";
import ListItem from "./ListItem.svelte";
    import Question from "./Question.svelte";

    let text = "";
    let selectionText = "";
    let results: any[] = [{
        title: "saldsladksajdksajdlka"
    }, {
        title: "asdsakdlasjdkl"
    }, {
        title: "sadlsakd"
    }];
    let hasMore = false;
    let loading = false;
    let questionModalOpened = false;
    let currentQuestion: any = null;

    function openModal(question: any) {
        currentQuestion = question;
        questionModalOpened = true;
    }

    function setPreviousState() {
        const previousState = vscode.getState();
        if (!previousState) {
            return;
        }

        text = previousState.text || "";
        selectionText = previousState.selectionText || "";
        results = previousState.results || [];
        hasMore = previousState.hasMore || false;
        loading = false;
    }

    function getFromSelection() {
        text = selectionText;
    }

    async function search() {
        try {
            loading = true;
            const { data } = await axios.get(
                `https://api.stackexchange.com/2.2/search/advanced`,
                {
                    params: {
                        order: "desc",
                        sort: "relevance",
                        q: text,
                        site: "stackoverflow",
                    },
                }
            );
            results = data.items;
            hasMore = data.hasMore;
        } catch (e) {
            console.log(e);
        } finally {
            loading = false;
        }
    }

    window.addEventListener("message", (event) => {
        const { command, payload } = event.data;
        if (command === "vscodeSelection") {
            selectionText = payload.text;
        }
    });

    // setPreviousState();

    setInterval(() => {
        // Update the saved state
        vscode.setState({ text, selectionText, results, hasMore });
    }, 100);
    
</script>

<style>

    * {
        user-select: none;
    }
    textarea {
        border: 1px solid var(--vscode-focusBorder);
        resize: vertical;
    }

    .loader-container {
        flex: 1;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    a {
        cursor: pointer;
    }
</style>

<h3>Issue</h3>

<form>
    <textarea placeholder="Write your issue here" bind:value={text} />
    <a on:click={getFromSelection} href="void(0)">
        Get selected text from editor
    </a>
    <button on:click={search}> Search </button>
</form>

<div class="list">
    {#if loading}
        <div class="loader-container">
            <ActivityIndicator />
        </div>
    {:else}
        <div style="height: 10px;"></div>
        {#if results.length}
            <h2>
                Results
            </h2>
        {/if}
        <div style="height: 10px;"></div>
        {#each results as result}
            <ListItem
                on:openModal={openModal}
                item={result}
            />
        {/each}
    {/if}
</div>

<Question 
    question={currentQuestion}
    opened={questionModalOpened}
/>
