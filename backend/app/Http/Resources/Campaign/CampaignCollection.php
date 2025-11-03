<?php

namespace App\Http\Resources\Campaign;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CampaignCollection extends ResourceCollection
{
    public $collects = CampaignResource::class;
}
