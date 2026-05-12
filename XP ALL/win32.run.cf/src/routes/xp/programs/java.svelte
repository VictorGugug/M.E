<script>
    import { unmount, mount } from 'svelte';
    import Window from '../../../lib/components/xp/Window.svelte';
    import Button from '../../../lib/components/xp/Button.svelte';
    import { runningPrograms,systemVolume, zIndex, hardDrive } from '../../../lib/store'

    export let id;
    export let window;
    export let get_self = () => null;
    export let parentNode;
    export let fs_item;
    export let exec_path;
    let iframe;

    export function destroy(){
        runningPrograms.update(programs => programs.filter(p => p != get_self()));
        unmount(get_self());
    }

    export let options = {
        title: 'Java',
        min_width: 500,
        min_height: 400,
        width: 700,
        height: 500,
        icon: '/images/xp/icons/Java.png',
        id: id,
        exec_path
    };

    async function open_file(){
        const OpenModal = (await import('../../../lib/components/xp/OpenModal.svelte')).default;
        let modal;
        modal = mount(OpenModal, {
            target: window.node_ref,
            props: { filetypes: ['.jpg'], filetypes_desc: 'Image Files', get_self: () => modal, on_open: (items) => { console.log('selected_items', items.map(el => $hardDrive[el])); unmount(modal); } },
        });
    }

    async function save_file(){
        const SaveModal = (await import('../../../lib/components/xp/SaveModal.svelte')).default;
        let filetypes = [
            {name: 'jpg image', value: '.jpg'},
            {name: 'png image', value: '.png'},
            {name: 'bmp image', value: '.bmp'}
        ]
        let modal;
        modal = mount(SaveModal, {
            target: window.node_ref,
            props: { filetypes, get_self: () => modal, on_save: (data) => { console.log('save location', $hardDrive[data.parent_id]); console.log('filename', data.filename); console.log(data.selected_filetype); unmount(modal); } },
        });
    }

    async function open_dialog(){
        const Dialog = (await import('../../../lib/components/xp/Dialog.svelte')).default;
        let buttons = [
            {
                name: 'OK',
                action: () => console.log('OK')
            },
            {
                name: 'Cancel',
                action: () => console.log('Cancel')
            }
        ]
        let dialog;
        dialog = mount(Dialog, {
            target: window.node_ref,
            props: {
                icon: '/images/xp/icons/RecycleBinempty.png',
                title: 'Confirm File Delete',
                message: 'Are you sure you want to send Sunset.jpg to the Reycle Bin? ',
                buttons,
                get_self: () => dialog,
            }
        });
    }

    
    

</script>



<Window options={options} bind:this={window} on_click_close={destroy}>
    <div slot="content" class="absolute inset-0 flex flex-col bg-xp-yellow">
        <Button title="Call Child" on_click={() => iframe.contentWindow.say_hello()}></Button>
        <iframe bind:this={iframe} src="/html/ffmpeg/index.html" class="w-full h-40" allow="cross-origin-isolated"></iframe>
    </div>
    
    
</Window>


<svelte:options accessors={true}></svelte:options>

