<template>
<div style="
    width: 100vw; height: 100vh;
" class="d-flex justify-content-center align-items-center">

    <SessionManager></SessionManager>


</div>
</template>
<script>
import SessionManager from "sfc/SessionManager/index.vue";
export default {
    components: {
        SessionManager,
    }
}
</script>