<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            You are currently previewing the city click the "+" icon to start tract the city
        </div>

        <!-- Weather overview -->
         <div class="flex flex-col items-center text-white py-12">
            <p class="text-4xl mb-2">{{ route.params.city }}</p>
            <p class="text-sm mb-12 text-white">
                {{ 
                    new Date(weatherData.currentTime).toLocaleDateString(
                        "en-us",
                        {
                            weekday: "short",
                            day: "2-digit",
                            month: "long",
                        }
                    )
                }}

                {{ 
                    new Date(weatherData.currentTime).toLocaleTimeString(
                        "en-us",
                        {
                            timeStyle: "short"
                        }
                    )
                }}
            </p>
         </div>

         

         <!-- Temperature -->
         <p class="text-8xl text-white">
            {{ Math.round((weatherData.current.temp - 32) * (5/9)) }}&deg;C
         </p>
         <div class="text-center text-white">
            <p>
                Feels Like
                {{ Math.round((weatherData.current.feels_like - 32) * (5/9) ) }}&deg;C
            </p>
            <p class="capitalize">
                {{ weatherData.current.weather[0].description }}
            </p>
            <img class="w-[150px] h-auto" :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" alt="">
         </div>

         <hr class=" border-white border-opacity-10 border w-full">

         <!-- Hourly Weather -->
          <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex  gap-10 overflow-scroll">
                    <div v-for="hourData in weatherData.hourly" :key="hourData.dt">
                        <p class="whitespace-nowrap text-md">
                            {{ 
                                new Date( hourData.currentTime).toLocaleTimeString(
                                    "en-us",{
                                        hour: "numeric"
                                    }
                                )
                            }}
                        </p>
                        <img class="w-[50px] h-auto" :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="">
                        <p class="text-xl">
                            {{ Math.round( (hourData.temp - 32) * (5/9)) }}&deg;C
                        </p>
                    </div>
                </div>
            </div>
          </div>

        <!-- Weekly Weather -->
         <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="my-4 text-white"> 7 Day Forcast </h2>
                <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{ 
                            new Date(day.dt * 1000).toLocaleDateString(
                                "en-us",
                                {
                                    weekday: "long"
                                }
                            )
                        }}
                    </p>
                    <img class="w-[50px] h-[50px] object-cover" :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="">
                    <div class="flex flex-1 gap-2 justify-end">
                        <p>H: {{ Math.round((day.temp.max - 32) * (5/9)) }}&deg;C </p>
                        <p>M: {{ Math.round((day.temp.min - 32) * (5/9)) }}&deg;C </p>
                    </div>
                </div>
            </div>
         </div>

         <div v-if="!route.query.preview" class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500" @click="removeCity()">
            <i class="fa-solid fa-trash fa-fw"></i>
            Remove City
         </div>
    </div>
</template>

<script setup>

    import axios from 'axios'
    import { useRoute, useRouter } from 'vue-router'
    const route = useRoute();

    const getWeatherData = async () => {
        try {
            const weatherData = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&appid=c8132e655486b879d57b4ec921ebe114&units=imperial`)
            
            const localOffset = new Date().getTimezoneOffset() * 60000
            const utc = weatherData.data.current.dt * 1000 + localOffset
            weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset

            // Calculate hourly weather offset
            weatherData.data.hourly.forEach( hour => {
                const utc = hour.dt * 1000 + localOffset
                hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
            })

            // Flicker Delay
            await new Promise((res) => setTimeout(res, 1000) )
            
            return weatherData.data;
        } catch(error) {
            console.log(error)
        } 
    }


    const weatherData = await getWeatherData();

    const router = useRouter();
    const removeCity = () => {
        const cities = JSON.parse(localStorage.getItem('savedCities'));
        const updatedCities = cities.filter( city => city.id !== route.query.id)
        localStorage.setItem(
            'savedCities',
            JSON.stringify(updatedCities)
        )
        router.push({
            name: 'home'
        })
    }
    
</script>
