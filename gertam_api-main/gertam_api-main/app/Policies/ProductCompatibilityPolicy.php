<?php

namespace App\Policies;

use App\Models\ProductCompatibility;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductCompatibilityPolicy
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
    public function view(User $user, ProductCompatibility $productCompatibility): bool
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
    public function update(User $user, ProductCompatibility $productCompatibility): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProductCompatibility $productCompatibility): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProductCompatibility $productCompatibility): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProductCompatibility $productCompatibility): bool
    {
        //
    }
}
