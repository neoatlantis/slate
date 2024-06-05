<template>
<div>

    <div v-if="!logged_in" style="width: 50vw">
        Login
    </div>

    <div v-if="logged_in">
        <slot></slot>
    </div>

</div>
</template>
<script>
import anime from 'animejs/lib/anime.es.js';


export default {
    mounted(){
    },

    data(){ return {
        logged_in: false,
    }},

}
</script>