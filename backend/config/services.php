<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'twilio' => [
        'sid' => env('TWILIO_SID', ''),
        'token' => env('TWILIO_TOKEN', ''),
        'from' => env('TWILIO_FROM', ''),
    ],

    'election' => [
        'base_url' => env('ELECTION_API_BASE_URL'),
        'api_key' => env('ELECTION_API_KEY'),
        'timeout' => env('ELECTION_API_TIMEOUT', 10),
        'cache_ttl' => env('ELECTION_API_CACHE_TTL', 30),
    ],

    'geo' => [
        'base_url' => env('GEO_API_BASE_URL'),
        'api_key' => env('GEO_API_KEY'),
        'timeout' => env('GEO_API_TIMEOUT', 10),
        'cache_ttl' => env('GEO_API_CACHE_TTL', 300),
    ],

    'google_maps' => [
        'base_url' => env('GOOGLE_MAPS_BASE_URL', 'https://maps.googleapis.com/maps/api'),
        'api_key' => env('GOOGLE_MAPS_API_KEY'),
        'timeout' => env('GOOGLE_MAPS_TIMEOUT', 10),
        'cache_ttl' => env('GOOGLE_MAPS_CACHE_TTL', 3600),
    ],

];
