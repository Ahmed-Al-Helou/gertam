<?php

namespace App\Policies;

use App\Models\User;
use App\Models\products_size_and_many;
use Illuminate\Auth\Access\Response;

class ProductsSizeAndManyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, products_size_and_many $productsSizeAndMany): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, products_size_and_many $productsSizeAndMany): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, products_size_and_many $productsSizeAndMany): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, products_size_and_many $productsSizeAndMany): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, products_size_and_many $productsSizeAndMany): bool
    {
        //
    }
}
