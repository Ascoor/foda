<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## SMS API

Endpoints for managing and sending SMS messages are available under the `/api/v1/sms` prefix.

| Method | Endpoint            | Description                |
|--------|---------------------|----------------------------|
| GET    | `/api/v1/sms`       | List sent or scheduled SMS |
| POST   | `/api/v1/sms`       | Send or schedule a message |
| GET    | `/api/v1/sms/{id}`  | Show a single message      |
| PUT    | `/api/v1/sms/{id}`  | Update or resend           |
| DELETE | `/api/v1/sms/{id}`  | Remove a message           |

### Examples

Send immediately:

```json
POST /api/v1/sms
{
    "message": "Hello world",
    "recipient": "+15551234567"
}
```

Schedule for later:

```json
POST /api/v1/sms
{
    "message": "Reminder",
    "recipient": "+15551234567",
    "scheduled_for": "2024-08-03T10:00:00Z"
}
```

## Live Data & External Integrations

The backend can stream live election and geospatial data by connecting to third-party APIs. Configure the following environment variables in `.env` to enable the integrations:

| Variable | Description |
|----------|-------------|
| `ELECTION_API_BASE_URL` | Base URL for the election results provider. |
| `ELECTION_API_KEY` | Bearer token used to authenticate election API requests. |
| `ELECTION_API_TIMEOUT` | Timeout (in seconds) for election API HTTP requests. |
| `ELECTION_API_CACHE_TTL` | Cache duration (in seconds) for election results. |
| `GEO_API_BASE_URL` | Base URL of the geospatial data provider. |
| `GEO_API_KEY` | API key header for the geospatial service. |
| `GEO_API_TIMEOUT` | Timeout (in seconds) for geospatial requests. |
| `GEO_API_CACHE_TTL` | Cache duration (in seconds) for geospatial responses. |
| `GOOGLE_MAPS_BASE_URL` | Google Maps API base URL (defaults to the public endpoint). |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key used for geocoding. |
| `GOOGLE_MAPS_TIMEOUT` | Timeout (in seconds) for Google Maps requests. |
| `GOOGLE_MAPS_CACHE_TTL` | Cache duration (in seconds) for Google Maps results. |

### Live Data API

Authenticated users can query real-time information via the `/api/v1/live` namespace:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/live/elections/{election}?broadcast=1` | Fetch the latest results for an election and broadcast them to listeners. |
| GET | `/api/v1/live/geo` | Retrieve live geospatial metrics (supports optional `lat`, `lng`, `radius`, `region`, and `level` query parameters). |
| GET | `/api/v1/live/maps/geocode?address=...` | Geocode an address using the configured Google Maps credentials. |

Include `refresh=1` in the elections endpoint to force a cache refresh before broadcasting.

### Live Broadcasting

Election updates are streamed over Laravel Echo using the `elections.live.{electionId}` channel. The `ElectionResultsUpdated` event broadcasts the payload:

```json
{
    "event": "ElectionResultsUpdated",
    "data": {
        "election_id": "42",
        "results": {"candidate_a": 12345}
    }
}
```

Clients connected through Laravel Echo or any compatible WebSocket implementation will receive real-time updates whenever the results are refreshed.
