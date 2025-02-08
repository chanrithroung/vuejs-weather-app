<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg  z-10">
        <nav class="container flex sm:flex-row items-center gap-4 text-white py-6">
            <RouterLink :to="{ name: 'home' }">
                <div class="flex items-center gap-3 flex-1">
                    <i class="fa-solid fa-sun text-2xl"></i>
                    <p class="text-2xl">The Local Weather</p>
                </div>
            </RouterLink>
            <div class="flex gap-3 flex-1 justify-end">
                <i @click="toggleModal" class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
                <i @click="addCity" v-if="route.query.preview" class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
            </div>

            <BaseModal :modalActive="modalActive" v-on:close-modal="toggleModal">
                <div class="text-black">
                    <h1 class="text-2xl text-black">About:</h1>
                    <p class="mb-4">
                        The local weather allows you to track the current and future weather of cities of your choosing.
                    </p>
                    <h2 class="text-2xl">How it works:</h2>
                    <ol class="list-decimal list-inside mb-4">
                        <li>Search for your city by entering the name into the search bar.</li>
                        <li>Select city within the result this will take you to current weather for your selection.</li>
                        <li>Track the city by clicking the '+' Icon in the top right this will save city to view later time on the home page</li>
                    </ol>
                    <h2 class="text-2xl">Removing City</h2>
                    <p>If you no longer to track a city, simply select the city within the home page, there will be am option to delete the city.</p>

                </div>
            </BaseModal>
        </nav>
    </header>
    
</template>

<script setup>
    import { RouterLink, useRoute, useRouter } from 'vue-router';    
    import BaseModal from './BaseModal.vue';
    import { ref } from 'vue';
    import { uid } from 'uid';

    const modalActive = ref(null);
    const toggleModal = () => modalActive.value = !modalActive.value;
    const savedCities = ref([]);
    const route = useRoute();
    const router = useRouter();

    const addCity = () => {
        if(localStorage.getItem('savedCities')) {
            savedCities.value = JSON.parse( localStorage.getItem('savedCities') );
        }
        const locationObject = {
            id: uid(),
            state: route.params.state,
            city: route.params.city,
            coords: {
                lat: route.query.lat,
                lng: route.query.lng
            }
        }

        savedCities.value.push( locationObject );
        localStorage.setItem(
            "savedCities", 
            JSON.stringify(savedCities.value)
        )

        let query = Object.assign({}, route.query);
        delete query.preview;
        query.id = locationObject.id
        router.replace( {query} )
    }   


</script>