<script>
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    import { faker } from '@faker-js/faker';
    import * as utils from '../../../lib/utils';
    
    import { onMount, createEventDispatcher } from 'svelte';
    let dispatcher = createEventDispatcher();

    let status_bar;

   

    onMount(async () => {
        
    })

    let current_option = 0;

    let options = [
        'Format the partition using the NTFS file system (Quick)',
        'Format the partition using the FAT file system (Quick)',
        'Format the partition using the NTFS file system',
        'Format the partition using the FAT file system',
    ]

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38://up
				current_option = Math.max(0, current_option - 1);
				break;
			 case 40://down
				 current_option = Math.min(options.length - 1, current_option + 1);
				break;
			 case 13://enter
                dispatcher('load_page', {url: './installation/dos/format.svelte'});
				 break;
            case 27://esc
                dispatcher('load_page', {url: './boot_manager.svelte'});
                break;
		 }
	}



</script>

<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi select-none">
    <div class="mt-2 sm:mt-4 text-base sm:text-xl font-bold text-slate-400 inline-block">
        <p class="px-2">Windows XP Professional Setup</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div>
    </div>
    <div class="ml-4 sm:ml-12 mt-4 sm:mt-8 text-sm sm:text-xl text-slate-300">
        <p>A new partition for Windows XP has been created on 10237 MB Disk 0 at Id 0 on bus 0 on atapi [MBR].</p>
        <p class="mt-2">This partition must be now formatted.</p>
        <p class="mt-2">From the list below, select a file system for the new partition.</p>
        <p>Use the UP and DOWN ARROW key to select the file system you want to use, then press ENTER.</p>
        <ul class="ml-2 sm:ml-4 mt-3 sm:mt-4">
            {#each options as option, i}
                <div>
                    <li class="inline-block px-1 cursor-pointer {current_option == i ? 'bg-slate-300 text-[rgb(2,7,176)]' : ''}"
                        on:click={() => current_option = i}
                        on:touchend|preventDefault={() => current_option = i}>{option}</li>
                </div>
            {/each}
        </ul>
        <button class="mt-6 sm:mt-8 ml-2 sm:ml-4 px-4 py-1 bg-slate-300 text-[rgb(2,7,176)] font-bold sm:hidden"
            on:click={() => dispatcher('load_page', {url: './installation/dos/format.svelte'})}>
            Continue →
        </button>
    </div>
</div>

<StatusBar bind:this={status_bar} l_message="ENTER=Continue&nbsp;&nbsp;&nbsp; ESC=Cancel" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />