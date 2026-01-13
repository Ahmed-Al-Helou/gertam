<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOverviewRequest;
use App\Http\Requests\UpdateOverviewRequest;
use App\Models\Order;
use App\Models\Overview;
use App\Models\Report;
use Carbon\Carbon;

class OverviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */


public function index(Report $report)
{
    $this->authorize('viewAdminOnly', $report);

    // آخر 10 طلبات
    $latestOrders = Order::latest()->with("orderItem")->take(10)->get();

    // التغير اليومي لكل حالة
    $statuses = ['confirmed', 'completed', 'canceled', 'hanging']; // عدّل حسب حالتك
    $dailyStats = [];

    foreach ($statuses as $status) {
        $todayCount = Order::whereDate('created_at', Carbon::today())
                            ->where('status', $status)
                            ->count();
        $yesterdayCount = Order::whereDate('created_at', Carbon::yesterday())
                               ->where('status', $status)
                               ->count();

        $changePercent = $yesterdayCount == 0
            ? ($todayCount > 0 ? 100 : 0)
            : (($todayCount - $yesterdayCount) / $yesterdayCount) * 100;

        $dailyStats[$status] = [
            'today_count' => $todayCount,
            'yesterday_count' => $yesterdayCount,
            'change_percent' => round($changePercent, 2)
        ];
    }

    // بيانات الرسم البياني الشهري
    $months = [
        'يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'
    ];

    $currentYear = Carbon::now()->year;
    $chartData = [];

    foreach ($months as $index => $monthName) {
        $monthNumber = $index + 1; // يناير = 1
        $monthlyOrders = Order::whereYear('created_at', $currentYear)
                              ->whereMonth('created_at', $monthNumber)
                              ->count();

        // هنا uv = عدد الطلبات، pv = يمكن وضع أي قيمة إضافية أو نفس العدد
        $chartData[] = [
            'name' => $monthName,
            'uv' => $monthlyOrders,
            'pv' => $monthlyOrders // أو قيمة مختلفة إذا عندك
        ];
    }

    return response()->json([
        'latest_orders' => $latestOrders,
        'daily_stats' => $dailyStats,
        'chart_data' => $chartData
    ]);
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
    public function store(StoreOverviewRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Overview $overview)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Overview $overview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOverviewRequest $request, Overview $overview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Overview $overview)
    {
        //
    }
}
