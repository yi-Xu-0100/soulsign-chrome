<template>
    <li class="pages-tree">
        <div :class="{bold: isFolder}" @click="toggle">
            {{ name }}
            <span class="Folder" v-if="isFolder">
                [{{ isOpen ? '-' : '+' }}]
            </span>
            <span class="Point" v-else>
                <br>{{ item }}
            </span>
        </div>
        <ul v-show="isOpen" v-if="isFolder">
            <Tree v-for="(item, name, index) in item" :item="item" :name="name" :key="index"></Tree>
        </ul>
    </li>
</template>
<script>
export default {
    name: "Tree",
	props: ["item", "name"],
	data() {
		return {
            isOpen: false,
		}
	},
    computed: {
        isFolder: function () {
            return "object" == typeof this.item && (true || this.item.length);
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) this.isOpen = !this.isOpen;
        }
    }
}
</script>
<style lang="less">
.pages-tree {
    span.Point {
        font-style: italic;
    }
}
</style>
