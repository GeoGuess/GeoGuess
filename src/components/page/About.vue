<template>
    <v-card>
        <v-card-title>
            <p>{{ $t('Home.about') }}</p>
        </v-card-title>
        <v-card-text>
            <p class="section-description">
                {{ $t('Home.aboutDescriptions.1') }}
                <br>{{ $t('Home.aboutDescriptions.2') }}
                <a href="https://geoguessmaster.com/">GeoGuess Master</a>.
            </p>

            <h3 class="section-header">
                {{ $t('Home.customMap') }}
            </h3>
            <p class="section-description">
                {{ $t('Home.customMapDescriptions.1') }}
                <br>{{ $t('Home.customMapDescriptions.2') }} <br><br>
                {{ $t('Home.customMapDescriptions.3') }}
                <a href="https://geojson.org/">GeoJson</a>
                {{ $t('Home.customMapDescriptions.4') }}
                {{ $t('Home.customMapDescriptions.5') }}
                <v-icon>mdi-map-plus</v-icon>.
                <br>
                {{ $t('Home.customMapDescriptions.6') }}
            </p>
            <ul>
                <li>
                    <a
                        href="https://gist.github.com/BilelJegham/7f855024440c67d65f24536c9215719e"
                    >Biggest cities world</a>
                </li>
                <li>
                    <a
                        href="https://gist.github.com/BilelJegham/b6a0faa627aac3b7f5bc677523c4c7eb"
                    >Hard Map</a>
                </li>
            </ul>
            <br>
            <h3 class="section-header">
                {{ $t('Home.limitation') }}
            </h3>
            <p class="section-description">
                {{ $t('Home.limitationDescription') }}
            </p>
        </v-card-text>
    </v-card>
</template>
