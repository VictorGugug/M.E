
<script>
    let EULA = '';
    import StatusBar from "../../../lib/components/dos/status_bar.svelte";
    
    import { onMount, createEventDispatcher } from 'svelte';

    onMount(async () => {
        let res = await fetch('/files/EULA.txt');
        let file = await res.blob();
        EULA = fmt_html(await file.text());
    })


    function fmt_html(input){
        return input.split('\n\n').join('<br/>');
    }

    let dispatcher = createEventDispatcher();
    let status_bar;
    let y_pos = 0;

    let _touch_start_y = null;
    function on_touchstart(e) {
        _touch_start_y = e.touches[0].clientY;
    }
    function on_touchend(e) {
        if (_touch_start_y == null) return;
        let delta = _touch_start_y - e.changedTouches[0].clientY;
        if (Math.abs(delta) < 10) {
            // tap (no significant swipe) → agree
            dispatcher('load_page', {url: './installation/dos/partition.svelte'});
        } else {
            y_pos = Math.min(0, y_pos - delta);
        }
        _touch_start_y = null;
    }

    function on_key_pressed(e) {
		 switch(e.keyCode) {
			 case 38:
				y_pos = Math.min(0, y_pos + 200);
				break;
			 case 40:
				y_pos = y_pos - 200;
				break;
			 case 13:
                dispatcher('load_page', {url: './installation/dos/partition.svelte'});
				 break;
            case 27:
                dispatcher('load_page', {url: './boot_manager.svelte'});
                break;
		 }
	}

</script>

<div class="absolute inset-0 bg-[rgb(2,7,176)] overflow-hidden font-Levi select-none">
    <div class="mt-2 sm:mt-4 text-base sm:text-xl font-bold text-slate-400 inline-block">
        <p class="px-2">Windows XP Licensing Agreement</p>
        <div class="w-full h-[1px] mb-1 bg-slate-400"></div>
        <div class="w-full h-[1px] bg-slate-400"></div>
    </div>
    <div class="mt-4 sm:mt-8 p-4 pb-12 h-[85vh] text-sm sm:text-xl text-slate-200 overflow-hidden relative"
        on:touchstart={on_touchstart} on:touchend={on_touchend}>
        <div class="absolute px-2" style:top="{y_pos}px">{@html EULA}</div>
    </div>
</div>

<StatusBar bind:this={status_bar} l_message="ENTER=I agree&nbsp;&nbsp;&nbsp; ESC=I do not agree&nbsp;&nbsp;&nbsp; ↓(Down)=Next page&nbsp;&nbsp;&nbsp;↑(Up)=Previous page" />

<svelte:window on:keydown|preventDefault={on_key_pressed} />