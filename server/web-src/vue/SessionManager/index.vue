<template>
<div>

    <template v-if="!logged_in">
        <div style="width: 50vw" class="d-flex">
            <div>Login</div>
            <div style="width: 80%">
                <PasswordInput @submit="submit"></PasswordInput>
            </div>
        </div>
        <div v-if="errmsg">{{ errmsg }}</div>
    </template>

    <div v-if="logged_in">
        <slot></slot>
    </div>

</div>
</template>
<script>
import _ from "lodash";
import api from "app/api";
import PasswordInput from "sfc/controls/PasswordInput.vue";
import socket from "app/socketio";


export default {
    mounted(){
        setInterval(()=>this.check_status(), 500);
    },

    methods: {
        async submit(password){
            let result = await api("/engine/unlock", {
                password,
            });

            let unlocked = _.get(result, "status.unlocked", false),
                errmsg = _.get(result, "error");
        },

        async check_status(){
            let result = await api("/engine", {}, { method: 'get'});
            this.logged_in = _.get(result, "status.unlocked");
        }
    },

    data(){ return {
        logged_in: false,
        errmsg: null,
    }},

    components: {
        PasswordInput,
    }
}
</script>