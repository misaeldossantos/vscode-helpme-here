<script lang="ts">
    import axios from "axios";
    import RpcCommands from "../core/RpcCommands";
    import ActivityIndicator from "./ActivityIndicator.svelte";
    import ListItem from "./ListItem.svelte";
    import Question from "./Question.svelte";

    const vscode = RpcCommands.vscodeApi;

    let text = "";
    let results: any[] = [];
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
        results = previousState.results || [];
        hasMore = previousState.hasMore || false;
        loading = false;
    }

    async function getFromSelection() {
        text = await RpcCommands.getEditorSelectedText();
    }

    async function getFromClipboard() {
        const clipboardText = await RpcCommands.getClipboardText();
        text += clipboardText.trim();
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

    setPreviousState();

    setInterval(() => {
        // Update the saved state
        vscode.setState({ text, results, hasMore });
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

    a {
        cursor: pointer;
    }

    .form * + * {
        margin-bottom: 5px;
    }

    .form {
        display: flex;
        flex-direction: column;
    }
</style>

<form class="form">
    <textarea rows="6" placeholder="Write your issue here" bind:value={text} />
    <a on:click={getFromSelection} href="void(0)">
        Get selected text from editor
    </a>
    <a on:click={getFromClipboard} href="void(0)"> Paste from clipboard </a>
    <button on:click={search}> Search on StackOverflow </button>
</form>

<div class="list">
    {#if loading}
        <div class="loader-container">
            <ActivityIndicator />
        </div>
    {:else}
        <div style="height: 10px;" />
        {#if results.length}
            <h2>Results</h2>
        {:else}
            <h2>No results found</h2>
        {/if}
        <div style="height: 10px;" />
        {#each results as result}
            <ListItem on:openModal={event => openModal(event.detail)} item={result} />
        {/each}
    {/if}
</div>

<Question question={currentQuestion} bind:opened={questionModalOpened} />
