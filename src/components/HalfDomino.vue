<template>
    <div class="half-domino">
        <div class="row-in-domino">
            <div class="surdot">
            <div class="dot" v-if="value === 4 || value === 5 || value === 6"></div></div>
            <div class="surdot"></div>
            <div class="surdot"><div class="dot" v-if="value === 2 || value === 3 || value === 4 || value === 5 || value === 6"></div></div>
        </div>
        <div class="row-in-domino">
            <div class="surdot"><div class="dot" v-if="value === 6"></div></div>
            <div class="surdot"><div class="dot" v-if="value === 1 || value === 3 || value === 5"></div></div>
            <div class="surdot"><div class="dot" v-if="value === 6"></div></div>
        </div>
        <div class="row-in-domino">
            <div class="surdot"><div class="dot" v-if="value === 2 || value === 3 || value === 4 || value === 5 || value === 6"></div></div>
            <div class="surdot"></div>
            <div class="surdot"><div class="dot" v-if="value === 4 || value === 5 || value === 6"></div></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: Number
    }
}
</script>

<style scoped>
.half-domino {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    border: solid 2px black;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.row-in-domino {
    height: 24px;
    padding: 2px;
}
.surdot {
    display: inline-block;
    width: 30%;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: black;
    margin: 0 auto;
}

</style>
