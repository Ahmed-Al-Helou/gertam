@extends('frontlayouts.layouts')

@section('css')

<style>
/* عنوان "لماذا تختارنا" */
.features-section .section-title {
    color: #008cc5 !important;
    position: relative;
}

/* خط أسفل العنوان */
.features-section .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background-color: #008cc5;
}

/* تنسيق رابط "الأسئلة الشائعة" بالكامل */
.features-section .nav-link,
.features-section .nav-link.active,
.features-section .nav-link span,
.features-section .nav-link i {
    color: #008cc5 !important;
    border-bottom: 2px solid #008cc5 !important;
}

/* الدائرة حول الأيقونات */
.features-section .srv-icon {
    background-color: #ffffff !important;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
}

/* لون الأيقونات */
.features-section .srv-icon i {
    color: #008cc5 !important;
    font-size: 24px;
}

/* تعديل عنوان "فئات المنتجات" */
.category-banner .section-title {
    color: #008cc5 !important;
    position: relative;
}

/* الخط تحت "فئات المنتجات" */
.category-banner .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background-color: #008cc5;
}

/* تعديل رابط "عرض المزيد" */
.category-banner .product-tab-btn .nav-link,
.category-banner .product-tab-btn .nav-link span {
    color: #008cc5 !important;
    border-bottom: 2px solid #008cc5 !important;
}




/* خط تحت "الأصناف الجديدة" */
.product-tab-section .section-title {
    position: relative;
}
.product-tab-section .section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background-color: #008cc5;
}

/* "عرض المزيد" - أيقونة/رابط بنفس اللون */
.product-tab-section .product-tab-btn .nav-link,
.product-tab-section .product-tab-btn .nav-link span {
    color: #008cc5 !important;
    border-bottom: 2px solid #008cc5 !important;
}

/* تغيير لون زر "اطلب المنتج" */
.product-tab-section .hero-button {
    background-color: #008cc5 !important;
    color: #ffffff !important;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    transition: 0.3s;
}

/* تأثير عند المرور بالماوس */
.product-tab-section .hero-button:hover {
    background-color: #0072a3 !important; /* درجة أغمق قليلاً */
    color: #ffffff !important;
}





/* شكل البطاقة */
.product-tab-section .product-default-single {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* تأثير عند المرور */
.product-tab-section .product-default-single:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

/* صورة المنتج */
.product-tab-section .product-default-img {
    max-height: 200px;
    object-fit: contain;
    margin-bottom: 15px;
}

/* اسم المنتج */
.product-tab-section .product-default-link a {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    display: block;
}

/* زر "اطلب المنتج" */
.product-tab-section .hero-button {
    background-color: #008cc5 !important;
    color: #ffffff !important;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    display: inline-block;
    margin-top: 10px;
    transition: background-color 0.3s ease;
    font-weight: 500;
    font-size: 14px;
}

/* تأثير عند المرور */
.product-tab-section .hero-button:hover {
    background-color: #0072a3 !important;
    color: #ffffff !important;
}


.company-logo-section {
    background-color: #ffffff !important;
}







</style>


<style>
    @media (min-width: 768px) {
        .slick-list.draggable {
            max-height: 450px;
        }

        .hero-content {
            top: 45%
        }

        .hero-img {
            max-height: 400px;
        }
    }
    
    
    .search-image {
        display: inline-block;
        position: absolute;
        left: 70px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }

    .search-image input {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 0px;
        top: -30px;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
    }

    .browse-file-img {
        position: absolute;
        top: -20px;
        left: 0;
        cursor: pointer;
        z-index: 1;
    }

    .search-image img {
        cursor: pointer;
    }

    .search-image::after {
    content: 'new';
    position: absolute;
    top: 20px;
    left: 12.5px;
    background: #46b590;
    color: #ffffff;
    padding: 0px 5px;
    border-radius: 5px;
    z-index: 99999;
}
</style>
@endsection

@section('content')
<div class="offcanvas-overlay"></div>

<!-- ...:::: Start Hero Area Section:::... -->
<div class="hero-area">

    <video autoplay muted loop id="myVideo">
        <source src="{{asset('assetsfront/images/video.mp4')}}" type="video/mp4">
    </video>

    <div class="hero-info">
        <h1 class="hero-text" data-animation="fadeInUp" data-delay="0.2s">@Lang('main.welcome')</h1>
        <p class="hero-text" data-animation="fadeInUp" data-delay="0.4s">@Lang('main.slogan')</p>
        <a href="{{route('front-product')}}" class="hero-button">@Lang('main.shopNow')</a>
    </div>

    <form class="hero-search" action="{{ route('front-product') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="header-search-box default-search-style d-flex">
            <input name="name" class="default-search-style-input-box" type="search" placeholder="@Lang('main.searchBy')" value="{{ request()->name }}">
            <div class="search-image">
                <input type="file" name="image" accept="image/*">
                <div class="browse-file-img">
                    <img src="{{asset('assetsfront/images/search-image.png')}}" alt="search" style="width: 40px; height: 40px; margin-left: 10px; margin-right: 10px;">
                </div>
            </div>
            <button class="default-search-style-input-btn" type="submit"><i class="icon-search"></i></button>
        </div>
    </form>

</div> <!-- ...:::: End Hero Area Section:::... -->

<div class="features-section section-top-gap-100">

    <div class="section-content-gap">
        <div class="container">
            <div class="row">
                <div class="section-content text-center d-flex justify-content-between align-items-md-center align-items-start flex-md-row flex-column">
                    <h3 class="section-title text-center" data-aos="fade-up" data-aos-delay="0">@Lang('main.WhyUs')</h3>
                    <ul class="tablist nav product-tab-btn" data-aos="fade-up" data-aos-delay="400">
                        <li>
                            <a class="nav-link active" href="{{route('front-faq')}}">
                                <span>@Lang('main.FAQ')</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="services">
        <div class="container">
            <div class="services-container">
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-briefcase"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv1Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv1Desc')
                        </p>
                         -->
                    </div>
                </div>
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-check"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv2Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv2Desc')
                        </p>
                         -->
                    </div>
                </div>
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-cubes"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv3Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv3Desc')
                        </p>
                         -->
                    </div>
                </div>
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-wrench"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv4Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv4Desc')
                        </p>
                         -->
                    </div>
                </div>
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-truck"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv5Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv5Desc')
                        </p>
                         -->
                    </div>
                </div>
                <div class="srv-box">
                    <div class="srv-icon">
                        <i class="fa fa-comments"></i>
                    </div>
                    <div class="text">
                        <h3>
                            @Lang('main.srv6Title')
                        </h3>
                        <!-- 
                        <p>
                            @Lang('main.srv6Desc')
                        </p>
                         -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!--<div class="elwatany section-top-gap-100">-->
<!--    <div class="container">-->
<!--        <div class="row align-items-center">-->
<!--            <div class="col-lg-6">-->
<!--                <div class="section-content text-center d-flex justify-content-between align-items-md-center align-items-start flex-md-row flex-column">-->
<!--                    <h3 class="section-title text-center" data-aos="fade-up" data-aos-delay="0">@Lang('main.watany')</h3>-->
<!--                </div>-->
<!--                <p class="mt-5">-->
<!--                    @Lang('main.watanyDesc')-->
<!--                </p>-->
<!--            </div>-->

<!--            <div class="col-lg-6">-->
<!--                <img class="img-fluid rounded" src="{{asset('assetsfront/images/watany.jpg')}}" alt="">-->
                <!--<img class="img-fluid" src="{{asset('assetsfront/images/watany-img.png')}}" alt="">-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->


@if($general->products == 'yes')
<!-- ...:::: Start Banner Section:::... -->
<div class="category-banner banner-section section-top-gap-100">

    <div class="section-content-gap">
        <div class="container">
            <div class="row">
                <div class="section-content text-center d-flex justify-content-between align-items-md-center align-items-start flex-md-row flex-column">
                    <h3 class="section-title text-center" data-aos="fade-up" data-aos-delay="0">@Lang('main.Catagories')</h3>
                    <ul class="tablist nav product-tab-btn" data-aos="fade-up" data-aos-delay="400">
                        <li>
                            <a class="nav-link active" href="{{route('front-category')}}">
                                <span>@Lang('main.showMore')</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Start Banner Wrapper -->
    <div class="banner-wrapper">
        <div class="container">
            <div class="row">
                @foreach($category as $categ)
                <div class="col-lg-6 col-md-6 col-12">
                    <!-- Start Banner Single -->
                    <div class="banner-single" data-aos="fade-up" data-aos-delay="0">
                        <a href="{{route('front-show-category',['id'=> $categ->id])}}" class="banner-img-link">
                            <img class="banner-img" src="{{asset('images/'.$categ->image)}}" alt="">
                        </a>
                        <div class="banner-content">
                            <span class="banner-text-tiny"> {{ $categ['name_'.app()->getLocale()] }}</span>
                            <a href="{{route('front-show-category',['id'=> $categ->id])}}" class="banner-link"> @Lang('main.Shop now')</a>
                        </div>
                    </div>
                    <!-- End Banner Single -->
                </div>
                @endforeach
            </div>
        </div>
    </div> <!-- End Banner Wrapper -->
</div> <!-- ...:::: End Banner Section:::... -->
@endif

@if($general->products == 'yes')
<!-- ...:::: Start Product Tab Section:::... -->
<div class="product-tab-section section-top-gap-100">
    <!-- Start Section Content -->
    <div class="section-content-gap">
        <div class="container">
            <div class="row">
                <div class="section-content text-center d-flex justify-content-between align-items-md-center align-items-start flex-md-row flex-column">
                    <h3 class="section-title text-center" data-aos="fade-up" data-aos-delay="0">@Lang('main.New items')</h3>
                    <ul class="tablist nav product-tab-btn" data-aos="fade-up" data-aos-delay="400">
                        <li>
                            <a class="nav-link active" href="{{route('front-product')}}">
                                <span>@Lang('main.showMore')</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div> <!-- End Section Content -->

    <!-- Start Tab Wrapper -->
    <div class="product-tab-wrapper" data-aos="fade-up" data-aos-delay="50">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="tab-content tab-animate-zoom">
                        <div class="tab-pane show active" id="car_and_drive">
                            <div class="product-default-slider product-default-slider-3grids-1row">
                                <!-- Start Product Defautlt Single -->
                                @foreach($products as $product)
                                <div class="product-default-single border-around text-center">
                                    <div class="product-img-warp">
                                        <a href="{{route('front-show-product',['id'=> $product->id])}}" class="product-default-img-link">
                                            <img src="{{asset('images/'.$product->image)}}" alt="" class="product-default-img img-fluid">
                                        </a>
                                        <div class="product-action-icon-link">
                                            <ul>
                                                <li>
                                                    <a href="#" id="add-to-cart" class="offcanvas-toggle" data-id="{{$product->id}}" data-name="{{$product['name_'.app()->getLocale()]}}" data-image="{{asset('images/'.$product->image)}}" data-nickname-main="{{$product->nickname_main}}" data-nickname-st="{{$product->nickname_st}}" data-nickname-num="{{$product->nickname_num}}" data-quantity="1">
                                                        <i class="fa fa-shopping-cart"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="product-default-content">
                                        <h6 class="product-default-link"><a href="{{route('front-show-product',['id'=> $product->id])}}">{{ $product['name_'.app()->getLocale()] }}</a></h6>
                                        @foreach($info as $inf)
                                        @php
                                        $link = "https://wa.me/{$inf->whatsapp}?text=";
                                        $link .= "السلام عليكم";
                                        $link .= "%0a";
                                        $link .= "عندي استفسار بخصوص المنتج";
                                        $link .= "%0a";
                                        $link .= $product['name_'.app()->getLocale()];
                                        $link .= "%0a";
                                        $link .= $product->nickname_main;
                                        $link .= "%0a";
                                        $link .= route('front-show-product',$product->id);
                                        @endphp
                                        {{--<a href="https://wa.me/{{$inf->whatsapp}}?text=من فضلك اريد هذا {{ $product['name_'.app()->getLocale()] }}" class="hero-button"> @Lang('main.request product')</a>--}}
                                        <a href="{{$link}}" class="hero-button"> @Lang('main.request product')</a>
                                        @endforeach
                                        <!-- <span class="product-default-price"><del class="product-default-price-off">$30.12</del> $25.12</span> -->
                                    </div>
                                </div>
                                @endforeach
                                <!-- End Product Defautlt Single -->
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- End Catagory Wrapper -->

        </div> <!-- ...:::: End Product Tab Section:::... -->
    </div>
</div>
@endif

<!--
<div class="banner-section section-top-gap-100">
    <div class="banner-wrapper">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="banner-single" data-aos="fade-up" data-aos-delay="0">
                        <a href="#" class="banner-img-link">
                            <img class="banner-img banner-img-big" src="{{asset('images/'.$general->slider)}}" alt="">
                        </a>
                        <div class="banner-content">
                            <span class="banner-text-small">{{$general->slider_txt1}}</span>
                            <h2 class="banner-text-big">{{$general->slider_txt2}}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
-->

@if($general->products == 'yes')
<!-- ...:::: Start Product Tab Section:::... -->
<div class="product-tab-section section-top-gap-100">
    <!-- Start Section Content -->
    <div class="section-content-gap">
        <div class="container">
            <div class="row">
                <div class="section-content text-center d-flex justify-content-between align-items-md-center align-items-start flex-md-row flex-column">
                    <h3 class="section-title" data-aos="fade-up" data-aos-delay="0">@Lang('main.Best selling items')</h3>
                    <ul class="tablist nav product-tab-btn" data-aos="fade-up" data-aos-delay="400">
                        <li>
                            <a class="nav-link active" href="{{route('front-product')}}">
                                <span>@Lang('main.showMore')</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Start Tab Wrapper -->
    <div class="product-tab-wrapper" data-aos="fade-up" data-aos-delay="50">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="tab-content tab-animate-zoom">
                        <div class="tab-pane show active" id="car_and_drive">
                            <div class="product-default-slider product-default-slider-3grids-1row">
                                <!-- Start Product Defautlt Single -->
                                @foreach($best as $product)
                                <div class="product-default-single border-around text-center">
                                    <div class="product-img-warp">
                                        <a href="{{route('front-show-product',['id'=> $product->id])}}" class="product-default-img-link">
                                            <img src="{{asset('images/'.$product->image)}}" alt="" class="product-default-img img-fluid">
                                        </a>
                                        <div class="product-action-icon-link">
                                            <ul>
                                                <li>
                                                    <a href="#" id="add-to-cart" class="offcanvas-toggle" data-id="{{$product->id}}" data-name="{{$product['name_'.app()->getLocale()]}}" data-image="{{asset('images/'.$product->image)}}" data-nickname-main="{{$product->nickname_main}}" data-nickname-st="{{$product->nickname_st}}" data-nickname-num="{{$product->nickname_num}}" data-quantity="1">
                                                        <i class="fa fa-shopping-cart"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="product-default-content">
                                        <h6 class="product-default-link"><a href="{{route('front-show-product',['id'=> $product->id])}}">{{ $product['name_'.app()->getLocale()] }}</a></h6>
                                        @foreach($info as $inf)
                                        @php
                                        $link = "https://wa.me/{$inf->whatsapp}?text=";
                                        $link .= "السلام عليكم";
                                        $link .= "%0a";
                                        $link .= "عندي استفسار بخصوص المنتج";
                                        $link .= "%0a";
                                        $link .= $product['name_'.app()->getLocale()];
                                        $link .= "%0a";
                                        $link .= $product->nickname_main;
                                        $link .= "%0a";
                                        $link .= route('front-show-product',$product->id);
                                        @endphp
                                        {{--<a href="https://wa.me/{{$inf->whatsapp}}?text=من فضلك اريد هذا {{ $product['name_'.app()->getLocale()] }}" class="hero-button"> @Lang('main.request product')</a>--}}
                                        <a href="{{$link}}" class="hero-button"> @Lang('main.request product')</a>
                                        @endforeach <!-- <span class="product-default-price"><del class="product-default-price-off">$30.12</del> $25.12</span> -->
                                    </div>
                                </div>
                                @endforeach
                                <!-- End Product Defautlt Single -->
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- End Catagory Wrapper -->


        </div> <!-- ...:::: End Product Tab Section:::... -->
    </div>
</div>
@endif

<!--
<div class="quote">
    <div class="container">
        <q>
            @Lang('main.slogan')
        </q>
        <p>
            @Lang('main.aboutCompany')
        </p>
        <a class="hero-button" href="{{route('front-contact')}}"> @Lang('main.Contact us')</a>
    </div>
</div>
-->

<!-- ...:::: Start Company Logo Section:::... -->
<div class="company-logo-section section-top-gap-100">
    <!-- Start Company Logo Wrapper -->
    <div class="company-logo-wrapper" data-aos="fade-up" data-aos-delay="50">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="company-logo-slider" data-slick='{ "slidesToShow": {{isset($company) ? ( count($company) >= 6 ? count($company) -2 : count($company) ) : 0 }},"slidesToScroll": {{isset($company) ? 1 : 0 }} }'>
                        <!-- Start Company logo Single -->
                        @foreach($company as $comp)
                        <div class="company-logo-single">
                            <img src="{{asset('images/'.$comp->image)}}" alt="" width="120" class="img-fluid company-logo-image">
                        </div> <!-- End Company logo Single -->
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div> <!-- End Company Logo Wrapper -->
</div>
<!-- ...:::: End Company Logo Section:::... -->


@endsection