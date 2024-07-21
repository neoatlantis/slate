<template><div>

<table style="width:100%; padding: 0.5em" v-if="!loading">
	<tr>
		<td>Endpoint URL:</td>
		<td>
			<input v-model="endpoint_url" type="text" @change="changed=true" style="width:100%" />
		</td>
	</tr>

	<tr>
		<td colspan="2">
			<button @click="save" :disabled="!changed">Save</button>
		</td>
	</tr>
</table>
<div v-else>
	Loading...
</div>

</div></template>
<script>
import _ from "lodash";
import browser from "common/browser";

export default {
	mounted(){
		this.init();
	},

	data(){
		return {
			loading: true,
			endpoint_url: "",
			changed: false,
		}
	},

	methods: {
		async init(){
			try{
				let results = await browser.storage.sync.get("endpoint_url");
				this.endpoint_url = _.get(results, "endpoint_url");
			} finally {
				this.loading = false;
			}
		},

		async save(){
			await browser.storage.sync.set({
				endpoint_url: this.endpoint_url.toString(),
			});
			this.changed = false;
		}
	}

}
</script>