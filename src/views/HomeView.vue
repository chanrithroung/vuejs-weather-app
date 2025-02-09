<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input @input="getSearchResult" v-model="searchQuery" type="text" class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]" placeholder="Search for a city or state">
            <ul v-if="mapboxSearchResult" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
                <p v-if="searchError"> Sorry have something when wrong! </p>
                <p v-if="!searchError && mapboxSearchResult.length == 0">No Result match your query try different term!</p>
                <template v-else>
                    <li class="cursor-pointer px-2 hover:bg-weather-primary hover:scale-105 hover:text-white transition" @click="previewCity(searchResult)" v-for="searchResult in mapboxSearchResult" :key="searchResult.id"> {{ searchResult.place_name }} </li>
                </template>
            </ul>
        </div>
        <div class="flex flex-col gap-4">
          <Suspense>
            <CityList> </CityList>
            <template #fallback>
              <!-- <div v-if="cityCout.length !== 0" class="gap-4 flex flex-col">
                <CityCardSkeleton v-for=" i in cityCout" :key="i" />
             </div> -->

             <CityCardSkeleton />

            </template>
          </Suspense>
        </div>
    </main>
</template>

<script setup>
  import CityList from '@/components/CityList.vue';
  import axios from 'axios';
  import CityCardSkeleton from '@/components/CityCardSkeleton.vue';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const mapboxAPIKey = 'pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q';
  const searchQuery = ref("");  
  const queryTimeout = ref(null);
  const mapboxSearchResult = ref(null);
  const searchError = ref(null);
  const router = useRouter();

  const getSearchResult = () => {
      clearTimeout(queryTimeout.value)
      queryTimeout.value = setTimeout( async () => {
          if (searchQuery.value != "") {
              try {
                const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&type=place`)
                mapboxSearchResult.value = result.data.features;
              } catch {
                searchError.value = true;
              }
              return;
          }
          mapboxSearchResult.value = null;
      }, 300);
  }

  // const cityCout = ref([]);

  // const countCity = () => {
  //   cityCout.value = JSON.parse(localStorage.getItem('savedCities'));
  //   console.log(cityCout.value.length)
  // }

  // countCity()

 
  const previewCity = (searchResult) =>  {
    const [city, state] = searchResult.place_name.split(",");
    router.push({
      name: 'cityView',
      params: { state: state.replace(/\s/g, ''), city },
      query: {
        lat: searchResult.geometry.coordinates[1],
        lng: searchResult.geometry.coordinates[0],
        preview: true,
      }
    })
  }

</script>
