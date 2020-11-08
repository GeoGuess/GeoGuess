<template>
    <div class="details-map_container">
        <h2>
            {{ properties.title }}
        </h2>
        <p>
            {{ properties.description }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'DetailsMap',
    props: ['properties'],
};
</script>

<style lang="scss" scoped>
.details-map_container {
    background: #ded3af;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 1% 2%;
    color: black;
}
</style>
