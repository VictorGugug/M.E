<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import * as utils from '../lib/utils';
    let dispatcher = createEventDispatcher();

    onMount(() => {
        utils.set_theme('none');
        run_post();
    })

    const MEM_TOTAL = 524288;
    let mem_count = 0;
    let mem_done = false;
    let drives_visible = false;
    let dmi_visible = false;
    let menu_visible = false;

    function run_post() {
        const duration = 1400;
        const start = Date.now();
        function step() {
            const t = Math.min((Date.now() - start) / duration, 1);
            mem_count = Math.floor(t * MEM_TOTAL);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                mem_count = MEM_TOTAL;
                mem_done = true;
                setTimeout(() => { drives_visible = true; }, 300);
                setTimeout(() => { dmi_visible = true; }, 900);
                setTimeout(() => { menu_visible = true; }, 1400);
            }
        }
        requestAnimationFrame(step);
    }

    let current_option = 0;
    const boot_options = [
        'Start Windows Normally',
        'Install Windows',
        'Onboard NIC (IPV4)',
        'Onboard NIC (IPV6)',
        'BIOS Setup',
        'Device Configuration',
        'BIOS Flash Update',
        'Change Boot Mode Settings'
    ];

    function on_key_pressed(e) {
        if (!menu_visible) return;
        switch(e.keyCode) {
            case 38: current_option = current_option == 0 ? boot_options.length - 1 : current_option - 1; break;
            case 40: current_option = current_option == boot_options.length - 1 ? 0 : current_option + 1; break;
            case 13: boot(); break;
        }
    }

    let selected = false;
    function boot() {
        if(selected) return;
        if(current_option == 0){
            selected = true;
            utils.set_installing_windows(false);
            dispatcher('load_page', {url: './xp/starting.svelte'});
        } else if(current_option == 1){
            selected = true;
            utils.set_installing_windows(true);
            dispatcher('load_page', {url: './installation/dos/starting.svelte'});
        }
    }
</script>

<div class="w-screen h-screen bg-black overflow-hidden font-mono text-[13px] leading-relaxed text-gray-200 p-4 sm:p-6 select-none">

    <!-- BIOS header -->
    <p class="text-white">Award Modular BIOS v6.00PG, An Energy Star Ally</p>
    <p>Copyright (C) 1984-2003, Award Software, Inc.</p>
    <p class="mt-1">ASUS P4S800-MX ACPI BIOS Revision 1008</p>
    <p>Copyright (C) 2003, ASUSTeK COMPUTER INC.</p>

    <div class="mt-3">
        <p>Main Processor : Intel(R) Pentium(R) 4 CPU 2.40GHz</p>
        <p>Memory Testing : {mem_count.toLocaleString()}K
            {#if mem_done}<span class="text-white">OK</span>{/if}
        </p>
    </div>

    {#if drives_visible}
    <div class="mt-3">
        <p>IDE Channel 0 Device 0 :  WDC WD400BB-00JRA0 &nbsp;&nbsp;40.0GB &nbsp;Ultra DMA Mode-5</p>
        <p>IDE Channel 0 Device 1 :  None</p>
        <p>IDE Channel 1 Device 0 :  ASUS DVD-E616A3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;48x/16x DVD-ROM</p>
        <p>IDE Channel 1 Device 1 :  None</p>
    </div>
    {/if}

    {#if dmi_visible}
    <div class="mt-3">
        <p>Verifying DMI Pool Data ......</p>
        <p class="mt-1">Boot from Hard Disk...</p>
    </div>
    {/if}

    {#if menu_visible}
    <div class="mt-4 border border-gray-500 inline-block min-w-[360px]">
        <p class="bg-gray-700 text-white px-3 py-0.5">Please select boot device:</p>
        <div class="px-3 py-1">
            {#each boot_options.slice(0, 2) as option, index}
                <div class="cursor-pointer py-0.5 {index == current_option ? 'bg-gray-200 text-black' : ''}"
                    on:click={() => { current_option = index; boot(); }}
                    on:touchend|preventDefault={() => { current_option = index; boot(); }}>
                    &nbsp;{option}
                </div>
            {/each}
            <div class="border-t border-gray-600 mt-1 pt-1">
            {#each boot_options.slice(2) as option, index}
                <div class="py-0.5 text-gray-500 {index+2 == current_option ? 'bg-gray-200 text-black' : ''}">
                    &nbsp;{option}
                </div>
            {/each}
            </div>
        </div>
        <p class="border-t border-gray-600 px-3 py-0.5 text-gray-400 text-[12px]">↑↓ to move &nbsp; Enter to select &nbsp; Tap option on touch</p>
    </div>
    {/if}

</div>

<svelte:window on:keydown={on_key_pressed} />