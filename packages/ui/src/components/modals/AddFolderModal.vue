<template>
    <form @submit.prevent="createFolder" v-if="showModalComp">
        <modal title="New Folder" v-model="showModalComp">
            <label>
                <div style="font-weight: 500; margin-bottom: 0.25rem">Name</div>
                <input type="text" class="full-width-input" v-model="folderName" placeholder="New Folder" required spellcheck="false" v-focus>
            </label>

            <template #footer>
                <button class="button">Create</button>
            </template>
        </modal>
    </form>
</template>

<script>
import Modal from '@/components/Modal.vue'

export default {
    directives: {
        focus: {
            mounted(element) {
                element.focus()
                element.select()
            }
        }
    },
    props: {
        showModal: Boolean,
        parentId: {
            type: String,
            default: null
        }
    },
    components: {
        Modal
    },
    data() {
        return {
            folderName: 'New Folder'
        }
    },
    computed: {
        showModalComp: {
            get() {
                return this.showModal
            },
            set(value) {
                this.$emit('update:showModal', value)
            }
        }
    },
    watch: {
        showModal() {
            if(this.showModal) {
                this.folderName = 'New Folder'
            }
        }
    },
    methods: {
        async createFolder() {
            this.$store.dispatch('createCollectionItem', {
                type: 'request_group',
                name: this.folderName,
                parentId: this.parentId
            })
            this.showModalComp = false
        }
    }
}
</script>
