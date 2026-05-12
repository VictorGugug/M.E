<script>
    export let l_message = '';
    export let r_message = '';
    export let show_separator = false;

    export async function display(messages){
        for(let {l, r, d} of messages){
            if(!l) l = '';
            if(!r) r = '';
            if(!d) d = 1000;
            l_message = l;
            r_message = r;
            await sleep(d);
        }
    }



    function sleep(ms) {
        return new Promise((resolve) => {
        setTimeout(resolve, ms);
        });
    } 
    

</script>


<div class="absolute bottom-0 left-0 right-0 bg-slate-200 text-slate-900 flex flex-row overflow-hidden font-MSSS min-h-[2rem]">
    <div class="grow py-1 font-bold px-2 sm:px-4 text-[11px] sm:text-sm leading-snug flex items-center flex-wrap">
        {@html l_message}
    </div>
    {#if show_separator}
        <div class="w-1 bg-slate-900"></div>
    {/if}
    <div class="basis-1/4 shrink-0 py-1 font-bold px-2 sm:px-4 text-[11px] sm:text-sm leading-snug flex items-center">
        {@html r_message}
    </div>
</div>

<svelte:options accessors={true}></svelte:options>