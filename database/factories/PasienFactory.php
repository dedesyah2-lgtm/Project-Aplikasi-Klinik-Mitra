<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pasien>
 */
class PasienFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => $this->faker->name(),
            'alamat' => $this->faker->address(),
            'nomor_telepon' => $this->faker->phoneNumber(),
            'jenis_kelamin' => $this->faker->randomElement(['Laki-laki', 'Perempuan']),
            'tanggal_lahir' => $this->faker->date(),
            'golongan_darah' => $this->faker->randomElement (['A', 'B', 'AB', 'O']),
            'pekerjaan' => $this->faker->jobTitle(),
            'nomor_ktp' => $this->faker->numerify('#################'),
        ];
    }
}
