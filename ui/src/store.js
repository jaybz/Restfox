import { createStore } from 'vuex'
import { nanoid } from 'nanoid'
import { toTree, flattenTree, handleRequest, filterTree } from './helpers'
import { db } from './db'

const store = createStore({
    state() {
        return {
            collection: [],
            collectionTree: [],
            tabs: [],
            activeTab: null,
            requestResponseStatus: {},
            requestResponses: {},
            showImportModal: false,
            collectionFilter: ''
        }
    },
    getters: {
        collectionTreeFiltered(state) {
            if(state.collectionFilter) {
                return filterTree(state.collectionTree, state.collectionFilter)
            }

            return state.collectionTree
        }
    },
    mutations: {
        addTab(state, tab) {
            const existingTab = state.tabs.find(tabItem => tabItem._id === tab._id)
            if(!existingTab) {
                state.tabs.push(tab)
            }
            state.activeTab = tab
        },
        setActiveTab(state, tab) {
            state.activeTab = tab
            if(state.activeTab._id in state.requestResponseStatus === false) {
                state.requestResponseStatus[state.activeTab._id] = 'pending'
                state.requestResponses[state.activeTab._id] = null
            }
        },
        closeTab(state, tab) {
            state.tabs = state.tabs.filter(tabItem => tabItem._id !== tab._id)
            if(state.activeTab && state.activeTab._id === tab._id) {
                delete state.requestResponseStatus[state.activeTab._id]
                delete state.requestResponses[state.activeTab._id]
                state.activeTab = null
            }
        },
        async sendRequest(state, activeTab) {
            state.requestResponseStatus[activeTab._id] = 'loading'
            state.requestResponses[activeTab._id] = await handleRequest(activeTab)
            state.requestResponseStatus[activeTab._id] = 'loaded'
        },
        showImportModal(state, value) {
            state.showImportModal = value
        },
        setCollectionTree(state, collectionTree) {
            state.collection = state.collection.concat(flattenTree(collectionTree))
            state.collection.forEach(item => {
                db.collections.put(JSON.parse(JSON.stringify(item)), [item._id])
            })
            state.collectionTree = collectionTree
        },
        setCollection(state, collection) {
            state.collection = collection
            state.collectionTree = toTree(state.collection)
        },
        clearCollection(state) {
            state.collection = []
            db.collections.clear()
            state.collectionTree = []
        },
        setCollectionFilter(state, filter) {
            state.collectionFilter = filter
        }
    }
})

export default store
