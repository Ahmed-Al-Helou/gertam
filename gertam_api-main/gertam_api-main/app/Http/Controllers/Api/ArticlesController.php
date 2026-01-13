<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticlesRequest;
use App\Http\Requests\UpdateArticlesRequest;
use App\Models\Articles;
use Illuminate\Http\Request;

class ArticlesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Articles::take(3)->get();
    }

    public function getAllArticeles (){
        return Articles::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "title" => "required|string|max:255",
            "subtitle" => "required|string|max:255",
            "content" => "required|string",
        ]);
        $article = Articles::create([
            "title" => $request->title,
            "subtitle" => $request->subtitle,
            "content" => $request->content,
            "image_url" => "",
        ]);
        if($request->hasFile('image')){
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/articles/'), $filename);
            $article->image_url = url('uploads/articles/' . $filename);
            $article->save();
        }
        return response()->json([
            "status" => true,
            "message" => "Article created successfully",
            "data" => $article
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Articles::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Articles $articles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Articles $articles, $id)
    {
        $request->validate([
            "title" => "required|string|max:255",
            "subtitle" => "required|string|max:255",
            "content" => "required|string",
        ]);
        $article = Articles::find($id);
        if(!$article){
            return response()->json([
                "status" => false,
                "message" => "Article not found"
            ], 404);
        }
        $article->title = $request->title;
        $article->subtitle = $request->subtitle;
        $article->content = $request->content;
        if($request->hasFile('image')){
            $file = $request->file('image');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/articles/'), $filename);
            $article->image_url = url('uploads/articles/' . $filename);
        }
        $article->save();
        return response()->json([
            "status" => true,
            "message" => "Article updated successfully",
            "data" => $article
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Articles $articles, $id)
    {
        $article = Articles::find($id);
        if(!$article){
            return response()->json([
                "status" => false,
                "message" => "Article not found"
            ], 404);
        }
        $article->delete();
        return response()->json([
            "status" => true,
            "message" => "Article deleted successfully"
        ], 200);
    }
}
