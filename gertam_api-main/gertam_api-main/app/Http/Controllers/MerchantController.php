<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateMerchantRequest;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MerchantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    // Get all merchants ordered by newest first
    $merchants = Merchant::orderBy('created_at', 'desc')->where('pledge', 1)->get();

    // Parse documents JSON for each merchant
    $merchants->transform(function ($merchant) {
        $merchant->documents = json_decode($merchant->documents ?? '[]', true);
        return $merchant;
    });

    return response()->json([
        'message' => 'تم جلب جميع طلبات التجار بنجاح',
        'merchants' => $merchants
    ], 200);
}

    public function getMerchantRequestById($id){
        $merchant = Merchant::findOrFail($id);
        
        $merchant->documents = json_decode($merchant->documents ?? '[]', true);
        return response()->json([
            'message' => 'تم جلب بيانات التاجر بنجاح',
            'merchant' => $merchant
        ], 200);
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
    // Validate input
    $validated = $request->validate([
        'fullName' => 'required|string|max:255',
        'storeName' => 'required|string|max:255',
        'email' => 'required|email|unique:merchants,email',
        'phone' => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',
        'address' => 'required|string|max:255',
        'idNumber' => 'required|string|max:50',
        'taxNumber' => 'nullable|string|max:50',
        'nationalAddress' => 'nullable|string|max:255',
        'commercialRegistration' => 'nullable|string|max:255',
        'pledge' => 'required',
        'files.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120', // max 5MB
    ], [
        'phone.regex' => 'رقم الهاتف يجب أن يحتوي على أرقام فقط',
        'files.*.mimes' => 'يجب أن تكون الملفات بصيغة PDF أو صورة فقط',
    ]);

    // Convert pledge to boolean
    $pledge = filter_var($request->pledge, FILTER_VALIDATE_BOOLEAN);

    // Create merchant record first (without documents)
    $merchant = Merchant::create([
        'user_id' => auth()->id() ?? 1,
        'full_name' => $request->fullName,
        'store_name' => $request->storeName,
        'email' => $request->email,
        'phone' => $request->phone,
        'address' => $request->address,
        'id_number' => $request->idNumber,
        'tax_number' => $request->taxNumber,
        'national_address' => $request->nationalAddress,
        'commercial_registration' => $request->commercialRegistration,
        'pledge' => $pledge,
        'documents' => json_encode([]),
    ]);

    $uploadedFiles = [];

    // Handle file uploads
    if ($request->hasFile('files')) {
        foreach ($request->file('files') as $file) {
            // Ensure valid file type
            $mime = $file->getClientMimeType();
            if (!in_array($mime, ['image/jpeg', 'image/png', 'application/pdf'])) {
                continue; // skip invalid files
            }

            // Store file in public storage
            $path = $file->store('merchants', 'public');

            // Build full URL
            $fullUrl = asset('storage/' . $path);

            $uploadedFiles[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $fullUrl,
                'type' => $mime,
            ];
        }

        // Save uploaded files in DB
        $merchant->documents = json_encode($uploadedFiles);
        $merchant->save();
    }

    

    return response()->json([
        'message' => 'تم حفظ بيانات التاجر بنجاح',
        'merchant' => $merchant
    ], 201);
}


    /**
     * Display the specified resource.
     */
    public function show(Merchant $merchant)
    {
        $user = auth()->user();
        $merchant = Merchant::where('user_id', $user->id)->first();
        $merchant->documents = json_decode($merchant->documents ?? '[]', true);
        if(!$merchant){
            return response()->json([
                'message' => 'لا يوجد بيانات للتاجر',
                'merchant' => null
            ], 404);
        }
        return $merchant;
        
    }
    public function getMerchantById($id){
        $user = auth()->user();
        $merchant = Merchant::where('id', $id)->where("user_id", $user->id)->first();
        if(!$merchant){
            return response()->json([
                'message' => 'لا يوجد بيانات للتاجر',
                'merchant' => null
            ], 404);
        }
        $merchant->documents = json_decode($merchant->documents ?? '[]', true);
        return response()->json([
            'message' => 'تم جلب بيانات التاجر بنجاح',
            'merchant' => $merchant
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Merchant $merchant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
    
        $merchant = Merchant::where('user_id', $user->id)
                            ->where('id', $id)
                            ->firstOrFail();
    
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'storeName' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20|regex:/^[0-9+\-\s]+$/',
            'address' => 'required|string|max:255',
            'idNumber' => 'required|string|max:50',
            'taxNumber' => 'nullable|string|max:50',
            'nationalAddress' => 'nullable|string|max:255',
            'commercialRegistration' => 'nullable|string|max:255',
            'pledge' => 'required',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
        ], [
            'phone.regex' => 'رقم الهاتف يجب أن يحتوي على أرقام فقط',
            'files.*.mimes' => 'يجب أن تكون الملفات بصيغة PDF أو صورة فقط',
        ]);
    
        $pledge = filter_var($request->pledge, FILTER_VALIDATE_BOOLEAN);
    
        $merchant->update([
            'full_name' => $request->fullName,
            'store_name' => $request->storeName,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'id_number' => $request->idNumber,
            'tax_number' => $request->taxNumber,
            'national_address' => $request->nationalAddress,
            'commercial_registration' => $request->commercialRegistration,
            'pledge' => $pledge,
        ]);
    
        $uploadedFiles = [];
    
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $mime = $file->getClientMimeType();
    
                if (!in_array($mime, ['image/jpeg', 'image/png', 'application/pdf'])) {
                    continue;
                }
    
                $path = $file->store('merchants', 'public');
                $uploadedFiles[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => asset('storage/' . $path),
                    'type' => $mime,
                ];
            }
    
            $merchant->update(['documents' => json_encode($uploadedFiles)]);
        }
    
        return response()->json(['message' => 'تم تحديث بيانات التاجر بنجاح', 'merchant' => $merchant]);
    }
    

    public function approveMerchantRequest( $id){
        $merchant = Merchant::findOrFail($id);
        $merchant->pledge = 2;
        $merchant->save();
        return response()->json([
            'message' => 'تم تأييد الطلب بنجاح',
            'merchant' => $merchant
        ], 200);
    }
    public function rejectMerchantRequest(Request $request,$id){
        $merchant = Merchant::findOrFail($id);
        $merchant->pledge = 0;
        if($request->has('reason')){
            $merchant->reason = $request->reason;
        }
        $merchant->save();
        return response()->json([
            'message' => 'تم رفض الطلب بنجاح',
            'merchant' => $merchant
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Merchant $merchant)
    {
        //
    }
}
