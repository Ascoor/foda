<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AreaResource;

class VoterResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'area' => new AreaResource($this->whenLoaded('area')),
            'address' => $this->address,
            'sex' => $this->sex,
            'birthdate' => $this->birthdate,
            'age' => $this->age,
            'bloodgroup' => $this->bloodgroup,
            'img_url' => $this->img_url,
            'ion_user_id' => $this->ion_user_id,
            'voter_id' => $this->voter_id,
            'add_date' => $this->add_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
