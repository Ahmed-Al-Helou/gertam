"use client"
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import Select, { SingleValue } from "react-select";

import styles from "../edit-product/editProduct.module.css";
import {RiDeleteBin2Fill} from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { useProduct } from "@/hooks/Product/useProduct";
import SuccessToast from "@/app/ui/statusMessage/SuccessToast";
import Sidebar from "@/components/slidebar/slidebar";
type Option = { value: number; label: string };
type Brand = { id: number; ar_name: string };
type Module = { id: number; ar_name: string; make_by: number };
type ModuleDate = { id: number; date_form: number; date_to: number; module_by: number };
type Engine = { id: number; ar_name: string; en_name: string; module_date_by: number };

// ----- Input Field Components -----
interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    helper?: string;
    required?: boolean;
}
const InputField = React.memo(({ label, type = "text", value, onChange, placeholder = "", helper = "", required = false }: InputFieldProps) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full border border-gray-300 bg-gray-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
        />
        {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
));

const TextAreaField = React.memo(({ label, value, onChange, placeholder = "", helper = "", required = false }: any) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full border bg-gray-100 border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            rows={4}
        />
        {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
));

// ----- Step Components -----
interface Step1Props {
    nameAr: string;
    setNameAr: React.Dispatch<React.SetStateAction<string>>;
    nameEn: string;
    setNameEn: React.Dispatch<React.SetStateAction<string>>;
    descriptionAr: string;
    setDescriptionAr: React.Dispatch<React.SetStateAction<string>>;
    descriptionEn: string;
    setDescriptionEn: React.Dispatch<React.SetStateAction<string>>;
    price: string;
    setPrice: React.Dispatch<React.SetStateAction<string>>;
    discount: string;
    setDiscount: React.Dispatch<React.SetStateAction<string>>;
    images: File[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    imagePreviews: string[];
    setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

const Step1 = React.memo(({
                              nameAr, setNameAr, nameEn, setNameEn,
                              descriptionAr, setDescriptionAr, descriptionEn, setDescriptionEn,
                              price, setPrice, discount, setDiscount,
                              images, setImages, imagePreviews, setImagePreviews
                          }: Step1Props) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);
            setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-inner border border-blue-200">
            <InputField label="اسم المنتج بل عربي " value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="مثال: هاتف ذكي" />
            <InputField label="اسم المنتج بل انجليزي" value={nameEn} onChange={e => setNameEn(e.target.value)} placeholder="Example: Smart Phone" />
            <TextAreaField label="الوصف بل عربي " value={descriptionAr} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDescriptionAr(e.target.value)} placeholder="أدخل وصف المنتج بالعربية" />
            <TextAreaField label="الصوف بل انجليزي " value={descriptionEn} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDescriptionEn(e.target.value)} placeholder="Enter product description in English" />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="السعر بل دولار الامريكي" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                <InputField label="الخصم % (اختياري) " type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
            </div>

            <div
                className="mt-4 mb-4 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <FiUpload className="text-5xl text-gray-400 mb-2" />
                <p className="text-gray-500">Drag & drop images here or click to upload</p>
                <input type="file" multiple onChange={handleImageChange} className="hidden" id="fileInput" />
            </div>

            {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className={styles.ProductImage} onClick={() => {
                            setImages(prev => prev.filter((_, i) => i !== idx));
                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                        }}>

                            <span className={styles.icon}><RiDeleteBin2Fill size={40}/></span>
                            <img  src={src} alt="Preview" className="h-32 w-32 object-cover rounded-lg border shadow" />

                        </div>                    ))}
                </div>
            )}
        </div>
    );
});

// Step2 Component


// Step2 Component - Multiple Compatibility
interface Compatibility {
    brand: Option | null;
    model: Option | null;
    yearFrom: number | null;
    yearTo: number | null;
    engine?: Option | null; // اختياري
}
interface Step2Props {
    selectedData: any;
    alternativeParts: string;
    setAlternativeParts: React.Dispatch<React.SetStateAction<string>>;
    compatibilities: Compatibility[];
    setCompatibilities: React.Dispatch<React.SetStateAction<Compatibility[]>>;
}

const Step2 = React.memo(({ selectedData, alternativeParts, setAlternativeParts, compatibilities, setCompatibilities }: Step2Props) => {

    const handleBrandChange = (index: number, option: Option | null) => {
        const newCompat = [...compatibilities];
        newCompat[index].brand = option;
        newCompat[index].model = null;
        newCompat[index].yearFrom = null;
        newCompat[index].yearTo = null;
        setCompatibilities(newCompat);
    };

    const handleModelChange = (index: number, option: Option | null) => {
        const newCompat = [...compatibilities];
        newCompat[index].model = option;
        newCompat[index].yearFrom = null;
        newCompat[index].yearTo = null;
        setCompatibilities(newCompat);
    };

    const handleYearChange = (index: number, from: number | null, to: number | null) => {
        const newCompat = [...compatibilities];
        newCompat[index].yearFrom = from;
        newCompat[index].yearTo = to;
        setCompatibilities(newCompat);
    };

    const addCompatibility = () => {
        setCompatibilities(prev => [...prev, { brand: null, model: null, yearFrom: null, yearTo: null, engine: null }]);
    };

    const removeCompatibility = (index: number) => {
        setCompatibilities(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-purple-50 p-6 rounded-2xl shadow-inner border border-purple-200 space-y-6">
            {compatibilities.map((comp, idx) => {
                const filteredModels = comp.brand
                    ? selectedData.module.filter((m: Module) => m.make_by === comp.brand!.value)
                    : [];
                return (
                    <div key={idx} className="border p-4 rounded-lg relative">
                        {compatibilities.length > 1 && (
                            <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => removeCompatibility(idx)}>
                                <TiDelete size={25}/>
                            </button>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Manufacturer</label>
                            <Select
                                options={selectedData.brands.map((b: Brand) => ({ value: b.id, label: b.ar_name }))}
                                value={comp.brand}
                                onChange={(option) => handleBrandChange(idx, option)}
                                placeholder="اختر الشركة"
                                isClearable
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Model</label>
                            <Select
                                options={filteredModels.map((m: Module) => ({ value: m.id, label: m.ar_name }))}
                                value={comp.model}
                                onChange={(option) => handleModelChange(idx, option)}
                                placeholder="اختر الموديل"
                                isClearable
                                isDisabled={!comp.brand}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Year From</label>
                                <input
                                    type="number"
                                    placeholder="سنة من"
                                    value={comp.yearFrom ?? ""}
                                    onChange={(e) => handleYearChange(idx, Number(e.target.value) || null, comp.yearTo)}
                                    className="w-full border bg-gray-100 border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Year To</label>
                                <input
                                    type="number"
                                    placeholder="سنة إلى"
                                    value={comp.yearTo ?? ""}
                                    onChange={(e) => handleYearChange(idx, comp.yearFrom, Number(e.target.value) || null)}
                                    className="w-full border bg-gray-100 border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            <button type="button" onClick={addCompatibility} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow">
                أضف توافق جديد
            </button>

            <TextAreaField
                label="الاراقام البديلة (اختياري) "
                value={alternativeParts}
                onChange={(e: any) => setAlternativeParts(e.target.value)}
                placeholder="RENAULT: 7701044085 | ABAKUS: 3148G04"
            />
        </div>
    );
});


type Units = {
    id: number;
    ar_name: string;
    en_name: string;
    name: string;
}
// Step3 Component
interface Step3Props {
    quantity: string;
    setQuantity: React.Dispatch<React.SetStateAction<string>>;
    salesUnit: string;
    setSalesUnit: React.Dispatch<React.SetStateAction<string>>;
    units: Units[]
}

const Step3 = React.memo(({ quantity, setQuantity, salesUnit, setSalesUnit, units }: Step3Props) => (
    <div className="bg-green-50 p-6 rounded-2xl shadow-inner border border-green-200">
        <InputField label="الكميه المتوفرة " type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1"> الوحدة</label>
            <select
                value={salesUnit}
                onChange={e => setSalesUnit(e.target.value)}
                className="w-full border border-gray-300  rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
            >
                <option value="">حدد الوحدة</option>

                {units.map((unit: Units, index:number) => (
                    <option value={unit.id} key={index}>{unit.ar_name}</option>
                ))}
            </select>
        </div>
    </div>
));

// ----- Main Component -----
export default function AddProduct() {
    const [step, setStep] = useState(1);

    // Step 1 states
    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descriptionAr, setDescriptionAr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Step 2 states
    const [selectedBrand, setSelectedBrand] = useState<Option[]>([]);
    const [selectedModule, setSelectedModule] = useState<Option[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedEngine, setSelectedEngine] = useState<number | null>(null);
    const [alternativeParts, setAlternativeParts] = useState("");
    // داخل Main component AddProduct
// Step2 states
const [compatibilities, setCompatibilities] = useState<Compatibility[]>([
    { brand: null, model: null, yearFrom: null, yearTo: null, engine: null }
]);


    // Step 3 states
    const [quantity, setQuantity] = useState<string>("100");
    const [salesUnit, setSalesUnit] = useState("1");
    const [loading, setLoading] = useState(false);
    const { selectedData, units } = useProduct();

    const [successVisible, setSuccessVisible] = useState(false);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("arName", nameAr);
        formData.append("enName", nameEn);
        formData.append("arDescription", descriptionAr);
        formData.append("enDescription", descriptionEn);

        const exchangeRate = 3.75; // عدد الريالات لكل دولار

        // حساب السعر بعد الخصم
        let finalPrice = Number(price) - (Number(price) * Number(discount) / 100);

        // تحويل السعر من ريال سعودي إلى دولار
        let priceInDollar = finalPrice / exchangeRate;

        // إرسال السعر بالدولار (بعد الخصم)
        formData.append("price", priceInDollar.toString());

        // إرسال السعر قبل الخصم بالدولار
        const oldPriceInDollar = Number(price) / exchangeRate;
        formData.append("old_price", oldPriceInDollar.toString());
        formData.append("categories_id", "1");
        formData.append("thumbnail", images[0] ? images[0] : "");
        formData.append("alternative_parts", alternativeParts);
        formData.append("unit_id", salesUnit);
        formData.append("stock", quantity);
        compatibilities.forEach((c, idx) => {
            if(c.brand) formData.append(`compatibilities[${idx}][brand_id]`, c.brand.value.toString());
            if(c.model) formData.append(`compatibilities[${idx}][model_id]`, c.model.value.toString());
            if(c.yearFrom) formData.append(`compatibilities[${idx}][year_from]`, c.yearFrom.toString());
            if(c.yearTo) formData.append(`compatibilities[${idx}][year_to]`, c.yearTo.toString());
        });

        formData.append("engine_id", selectedEngine ? selectedEngine.toString() : "");


        images.forEach(file => formData.append("Images[]", file));

        const token = localStorage.getItem("token");



        try {
            for (const pair of formData.entries()) {
            }

            
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/store/addProduct`, {
                method: "POST",
                  
                headers: {
                    Accept: "application/json",
                    "Authorization": `Bearer ${token}` // فقط التوكين، لا تحدد Content-Type
                },
                body: formData
            });

            const data = await res.json();
            if (res.ok){
                setError("");
                setSuccessVisible(true);
                setTimeout(()=> location.reload() , 1000);
            } else setError(data.error || "حدث خطأ غير متوقع");
        } catch (err: any) {
            alert(err.message || "حدث خطأ أثناء الرفع");
        }finally {
            setLoading(false);
        }
    };


    const stepsLabels = ["المعومات الاساسية", "التفاصيل", "السعر والكم"];
    const StepIndicator = () => (
        <div className="flex justify-between mb-8">
            {stepsLabels.map((s, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center relative">
                    <div
                        className={`w-10 h-10 z-10 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-300 ${
                            step === idx + 1 ? "bg-blue-600 shadow-lg scale-110" : step > idx + 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                        {idx + 1}
                    </div>
                    <span className="mt-2 text-sm text-gray-700">{s}</span>
                </div>
            ))}
        </div>
    );

    return (
        <>
        <Sidebar>
            <SuccessToast show={successVisible} onClose={() => setSuccessVisible(false)} />
            <div className="min-h-screen flex items-center justify-center p-4 font-sans Container" dir="rtl">
                <div className="rounded-3xl w-full max-w-4xl p-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">اضافة منتج جديد</h1>
                    <StepIndicator/>
                    <div className="w-full max-w-md mx-auto mt-4">
                        {error && (
                            <div className="flex items-center bg-red-100 border  border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold mr-2">خطأ:</strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && <Step1 {...{
                            nameAr,
                            setNameAr,
                            nameEn,
                            setNameEn,
                            descriptionAr,
                            setDescriptionAr,
                            descriptionEn,
                            setDescriptionEn,
                            price,
                            setPrice,
                            discount,
                            setDiscount,
                            images,
                            setImages,
                            imagePreviews,
                            setImagePreviews
                        }} />}
                        {step === 2 && <Step2 {...{
    selectedData,
    alternativeParts,
    setAlternativeParts,
    compatibilities,
    setCompatibilities
}} />}

                        {step === 3 && <Step3 {...{quantity, setQuantity, salesUnit, setSalesUnit, units}} />}

                        <div className="flex justify-between mt-6">
                            {step > 1 && <button type="button" onClick={prevStep}
                                                 className="px-6 py-3 ml-5 bg-gray-300 text-gray-700 rounded-2xl hover:bg-gray-400 shadow transition">Back</button>}
                            {step < 3 && <button type="button" onClick={nextStep}
                                                 className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow transition">Next</button>}
                            {step === 3 && <button type="submit"
                                                   className="ml-auto px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 shadow transition">Submit</button>}
                        </div>
                    </form>
                </div>
            </div>
            </Sidebar>
        </>
    );
}
