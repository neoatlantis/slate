<template>
<div>

    <div v-if="!logged_in" style="width: 50vw" class="d-flex">
        <div>Login</div>
        <div style="width: 80%">
            <PasswordInput></PasswordInput>
        </div>
    </div>

    <div v-if="logged_in">
        <slot></slot>
    </div>

</div>
</template>
<script>
import PasswordInput from "sfc/controls/PasswordInput.vue";


export default {
    mounted(){
    },

    data(){ return {
        logged_in: false,
    }},

    components: {
        PasswordInput,
    }
}
</script>