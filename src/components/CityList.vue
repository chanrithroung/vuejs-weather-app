<template>
    <div v-for="city in saveCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)"></CityCard>
    </div>
    <p v-if="saveCities.length === 0">
        No Content added. To start tracking a location, search in the field above.
    </p>
</template>

<script setup>
    
    import axios from 'axios';
    import { ref } from 'vue';
    import CityCard from './CityCard.vue';
    import { useRouter } from 'vue-router';

    const saveCities = ref([]);

    const getCities = async () => {
        if( localStorage.getItem('savedCities')) {
            saveCities.value = JSON.parse(localStorage.getItem('savedCities'))
        }
        const requests = [];

        saveCities.value.forEach(city => {
            requests.push( 
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=4f2773bd9bc9888901dcb54a69a8202e&units=imperial`)
            );
        })
        
        const weatherData = await Promise.all(requests);

        // Flicker Delay
        await new Promise( (res) => setTimeout(res, 1000))

        weatherData.forEach((value, index) => {
            saveCities.value[index].weather = value;
        })
    }
    await getCities();
    console.log(saveCities);

    const router = useRouter();
    const goToCityView = (city) => {
        router.push({
            name: 'cityView',
            params: {
                state: city.state,
                city: city.city
            },
            query: {
                id: city.id,
                lat: city.coords.lat,
                lng: city.coords.lng
            }

        })
    }
</script>