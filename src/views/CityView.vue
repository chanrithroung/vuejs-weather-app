<template>
    <div>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <CitySkeleton />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
    import CitySkeleton from '@/components/CitySkeleton.vue';
    import AsyncCityView from '../components/AsyncCityView.vue';
</script> 