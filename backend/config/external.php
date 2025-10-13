<?php

return [
    'cache_ttl' => env('EXTERNAL_CACHE_TTL', 30),
    'geo' => [
        'base_url' => env('EXTERNAL_GEO_BASE_URL', 'https://example.com'),
        'areas_endpoint' => env('EXTERNAL_GEO_AREAS_ENDPOINT', '/ec/geo-areas'),
        'timeout' => env('EXTERNAL_GEO_TIMEOUT', 5),
        'headers' => array_filter([
            'Accept' => 'application/json',
            'X-Api-Key' => env('EXTERNAL_GEO_API_KEY'),
        ]),
    ],
    'elections' => [
        'base_url' => env('ELECTION_API_BASE_URL', 'https://example.com'),
        'summary_endpoint' => env('ELECTION_API_SUMMARY_ENDPOINT', '/ec/elections/summary'),
        'results_endpoint' => env('ELECTION_API_RESULTS_ENDPOINT', '/ec/elections/results'),
        'turnout_endpoint' => env('ELECTION_API_TURNOUT_ENDPOINT', '/ec/elections/turnout'),
        'timeout' => env('ELECTION_API_TIMEOUT', 5),
        'headers' => array_filter([
            'Accept' => 'application/json',
            'X-Api-Key' => env('ELECTION_API_KEY'),
        ]),
    ],
    'maps' => [
        'base_url' => env('GOOGLE_MAPS_BASE_URL', 'https://maps.googleapis.com/maps/api'),
        'key' => env('GOOGLE_MAPS_API_KEY'),
        'default_zoom' => env('GOOGLE_MAPS_DEFAULT_ZOOM', 7),
        'default_map_type' => env('GOOGLE_MAPS_DEFAULT_TYPE', 'roadmap'),
    ],
];
