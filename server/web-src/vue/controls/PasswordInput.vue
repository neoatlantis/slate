<style module>
.container{
    width: 100%; height: 100%;
    border-width: 0 0 1px 0;
    outline:none;
    border-style: solid;
    font-size: 0.8em;
    caret-color: transparent;
}
.container:focus{
    outline: none;
    border-color: orange;
}
.text{
    font-size: 0.8em;
    font-family: Sheikah;
}
</style>
<template>
<div
    contenteditable="true"
    spellcheck="false"
    :class="$style.container"
    class="justify-content-center align-items-center d-flex"
    ref="container"

    @keydown.prevent.stop="on_keydown"
    @focus="run_background(true)"
    @focusout="run_background(false)"
>
    <TransitionGroup
        :css="false"
        @enter="on_enter"
        @leave="on_leave"
    >
        <span
            :class="$style.text"
            class="sheikah-font-style"
            v-for="c in pseudovalue" :key="'text-'+c.id"
        >{{c.c}}</span>
    </TransitionGroup>
</div>
</template>
<script>
import _ from "lodash";
import anime from "animejs";

let counter = 0;

export default {

    mounted(){
        this.focus_animation = anime({
            targets: this.$refs["container"],
            backgroundColor: ['rgba(255,41,0,0)', 'rgba(255,41,0,0.2)'],
            direction: 'alternate',
            loop: true,
            duration: 1000,
            delay: 0,
            endDelay: 0,
            easing: 'cubicBezier(.5, .05, .1, .3)',
        });
        this.run_background(false);
    },

    data(){ return {
        focus_animation: null,
        value: "",
        pseudovalue: [],
    }},

    methods: {

        run_background(run){
            if(run){
                this.focus_animation.restart();
                this.focus_animation.play();
            } else {
                this.focus_animation.restart();
                this.focus_animation.pause();
            }
        },

        add_pseudo_char(length){
            if(!length) length=1;
            for(let i=0; i<length; i++){
                this.pseudovalue.push({
                    c: String.fromCharCode(Math.floor(97+Math.random()*26)),
                    id: counter++,
                });
            }
        },

        on_keydown(e){
            const target = e.originalTarget;
            

            if(/^[\x20-\x7e]$/.test(e.key)){
                this.value += e.key;
                if(this.pseudovalue==""){
                    this.add_pseudo_char(10);
                } else {
                    this.add_pseudo_char(1);
                    this.pseudovalue.shift();
                }
            } else {
                /// #if DEV
                console.log(e);
                /// #endif
            }

            if(_.includes(["Delete", "Backspace"], e.key)){
                this.value = "";
                this.pseudovalue = [];
            }

            if(_.includes(["Enter"], e.key)){
                this.pseudovalue = [];
                this.$emit("submit", this.value.toString());
                this.value = "";
            }

        },


        on_enter(el, done){
            anime({
                targets: el,
                translateX: [30, 0],
                complete: done,
                duration: 500,
                opacity: [0, 1],
            })
        },

        on_leave(el, done){
            anime({
                targets: el,
                translateX: [0, -30],
                complete: done,
                duration: 500,
                opacity: [1, 0],
            })
        }
    }

}
</script>