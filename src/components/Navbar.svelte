<script lang="ts">
    import { dev } from '$app/environment';
    import type { PortfolioGlobals } from '$types';

    export let path: { url: string, txt: string }[];
    export let globals: PortfolioGlobals;

    function reload() {
      fetch('/reload', { method: 'POST' })
        .then(() => location.reload())
        .catch(e => console.error('Error reloading data', e));
    }

    // This function needs to accept `path` as an input, otherwise the links
    // stop being reactive due to cacheing or something
    function pathTo(path: { url: string, txt: string }[], i: number) {
      return path.slice(0, i + 1).map(p => p.url).join('/');
    }
</script>
<nav>
    <span style:grid-area="navigator">
        {#if path.length === 0}
            <h1>{globals.config.name} / Portfolio</h1>
        {:else}
            <h1>
                <a href="/">{globals.config.name}</a> /
                {#each path.slice(0, -1) as p, i}
                    <a href="/{pathTo(path, i)}">{p.txt}</a>
                    {'/ '}
                {/each}
                {path[path.length - 1].txt}
            </h1>
        {/if}
    </span>
    {#if dev}
    <span id="dev-tools">
        <button on:click={reload}>
            Reload data
        </button>
    </span>
    {/if}
</nav>

<style>
    nav {
        display: grid;
        grid-template-columns: 1fr auto 100px;
        grid-template-areas: "navigator empty dev-tools";
    }

    a {
        color: black;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }

    h1 {
        font-size: 3em;
    }

    #dev-tools {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: dev-tools;
    }
    #dev-tools > button {
        background-color: rgb(255, 157, 255);
        border-radius: 10px;
        border-color: rgb(214, 79, 255);
        border-style: solid;
        padding: 10px;
    }
    #dev-tools > button:hover {
        cursor: pointer;
        background-color: rgb(255, 109, 255);
    }
</style>
