"use client"
import { useState } from "react"
import Select from "react-select"
import styles from "./addcar.module.css"

type Brand = { id: number; ar_name: string }
type Module = { id: number; ar_name: string; make_by: number }
type ModuleDate = { id: number; date_form: number; date_to: number; module_by: number }
type Engine = { id: number; ar_name: string; en_name: string; module_date_by: number }

type ApiData = { brands: Brand[]; module: Module[]; enginees: Engine[]; ModuleDate: ModuleDate[];
    onClose: () => void;
    onAdd: (newCar: any) => void;
}

const AddCar = ({ data}: { data: ApiData  }) => {
    const [image, setImage] = useState<File | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
    const [selectedModule, setSelectedModule] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [selectedEngine, setSelectedEngine] = useState<number | null>(null)

    // الموديلات بعد اختيار الشركة
    const filteredModules = selectedBrand
        ? data.module.filter((m) => m.make_by === selectedBrand)
        : []

    // فترات الموديل (ModuleDate) بعد اختيار الموديل
const filteredModuleDates = selectedModule
    ? data.ModuleDate.filter((md) => md.module_by === selectedModule)
    : []

// إنشاء Set لتخزين السنوات الفريدة
const uniqueYears = new Set<number>()

// جمع السنوات الفريدة من جميع الفترات
filteredModuleDates.forEach((md) => {
    for (let y = md.date_form; y <= md.date_to; y++) {
        uniqueYears.add(y)
    }
})

// تحويل السنوات الفريدة إلى خيارات Select
const yearsOptions = Array.from(uniqueYears)
    .sort((a, b) => a - b) // ترتيب تصاعدي
    .map((y) => ({ value: y, label: y }))

    

    // المحركات المتاحة بعد اختيار الموديل
    const filteredEngines = selectedModule
        ? data.enginees.filter((e) =>
            filteredModuleDates.some((md) => md.id === e.module_date_by)
        )
        : []

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if ( !selectedBrand || !selectedModule || !selectedYear ) {
            alert("اختر كل الحقول وصورة السيارة")
            return
        }

        const formData = new FormData()
        if(image){
            formData.append("image_url", image)
        }

        formData.append("car_name", filteredModules.find((m) => m.id === selectedModule)?.ar_name || "")
        formData.append("brand", data.brands.find((b) => b.id === selectedBrand)?.ar_name || "")
        formData.append("module", filteredModules.find((m) => m.id === selectedModule)?.ar_name || "")
        formData.append("date", selectedYear.toString())
        formData.append("engaine", filteredEngines.find((e) => e.id === selectedEngine)?.ar_name || "")

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_APP_BASE_URL}/createCarGrage`, {
                method: "POST",
                headers:{
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            const result = await res.json()
            location.reload();

        } catch (err) {
            alert("حدث خطأ أثناء الإرسال")
        }
    }

    return (
        <div className={styles.addCar}>
            <div className={styles.form}>
                <form onSubmit={handleSubmit} className={styles.formInner}>

                    <div className={styles.image}>
                        <label htmlFor="image">
                            <img
                                src={image ? URL.createObjectURL(image) : "/no-image.jpeg"}
                                alt="صورة السيارة"
                            />
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                hidden
                                onChange={(e) => e.target.files && setImage(e.target.files[0])}
                            />
                        </label>
                    </div>

                    <Select
                        options={data.brands.map((b) => ({ value: b.id, label: b.ar_name }))}
                        placeholder="اختر الشركة"
                        className={styles.select}
                        onChange={(option) => {
                            setSelectedBrand(option ? option.value : null)
                            setSelectedModule(null)
                            setSelectedYear(null)
                            setSelectedEngine(null)
                        }}
                        isClearable
                    />

                    <Select
                        options={filteredModules.map((m) => ({ value: m.id, label: m.ar_name }))}
                        placeholder="اختر الموديل"
                        className={styles.select}
                        onChange={(option) => {
                            setSelectedModule(option ? option.value : null)
                            setSelectedYear(null)
                            setSelectedEngine(null)
                        }}
                        isDisabled={!selectedBrand}
                        isClearable
                    />

                    <Select
                        options={yearsOptions}
                        placeholder="اختر السنة"
                        className={styles.select}
                        onChange={(option) => setSelectedYear(option ? option.value : null)}
                        isDisabled={!selectedModule}
                        isClearable
                    />

                    <Select
                        options={filteredEngines.map((e) => ({ value: e.id, label: e.ar_name }))}
                        placeholder="اختر المحرك"
                        className={styles.select}
                        onChange={(option) => setSelectedEngine(option ? option.value : null)}
                        isDisabled={!selectedModule}
                        isClearable
                    />

                    <button type="submit" className={styles.submitBtn}>
                        إضافة
                    </button>
                    <a href={"/garage"}>الغاء </a>
                </form>
            </div>
        </div>
    )
}

export default AddCar
