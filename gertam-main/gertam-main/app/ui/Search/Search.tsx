"use client"

import { useState } from "react"
import styles from "./saerch.module.css"
import { useRouter } from "next/navigation"
import { useSearch } from "@/hooks/search/useSearch"
import Loading from "@/app/ui/loaders/Loading"
import Select, { SingleValue } from "react-select"
import {useTranslation} from "react-i18next";

type Option = { value: number; label: string }

type Brand = { id: number; ar_name: string }
type Module = { id: number; ar_name: string; make_by: number }
type ModuleDate = { id: number; date_form: number; date_to: number; module_by: number }
type Engine = { id: number; ar_name: string; en_name: string; module_date_by: number }

type ApiData = {
    brands: Brand[]
    module: Module[]
    enginees: Engine[]
    ModuleDate: ModuleDate[]
}

const Search = () => {
    const {t} = useTranslation()
    const router = useRouter()
    const { data, isLoading } = useSearch()

    // بدل المصفوفات بـ id أو null
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
    const [selectedModule, setSelectedModule] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [selectedEngine, setSelectedEngine] = useState<number | null>(null)

    if (isLoading) return <Loading />
    if (!data) return null

    // الموديلات بعد اختيار الشركة
    const filteredModules = selectedBrand
        ? data.module.filter((m:Module) => m.make_by === selectedBrand)
        : []

    // فترات الموديل بعد اختيار الموديل
    // فترات الموديل بعد اختيار الموديل
const filteredModuleDates = selectedModule
    ? data.ModuleDate.filter((md: ModuleDate) => md.module_by === selectedModule)
    : []

// استخدام Map لتخزين السنوات الفريدة مع الـ id الخاص بالـ ModuleDate
    const yearMap = new Map<number, number>() // key: السنة, value: ModuleDate.id

    filteredModuleDates.forEach((md: ModuleDate) => {
        for (let y = md.date_form; y <= md.date_to; y++) {
            if (!yearMap.has(y)) {
                yearMap.set(y, md.id)
            }
        }
    })

    // تحويل Map إلى خيارات Select
    const yearsOptions: Option[] = Array.from(yearMap.entries())
        .sort((a, b) => a[0] - b[0]) // ترتيب السنوات تصاعديًا
        .map(([year, id]) => ({ value: year, label: year.toString() }))


    // المحركات
    const filteredEngines = selectedModule
        ? data.enginees.filter((e:Engine) =>
            filteredModuleDates.some((md:ModuleDate) => md.id === e.module_date_by)
        )
        : []

    const handleSearch = () => {
        if (!selectedBrand) {
            alert("اختر الشركة للحصول على نتائج")
            return
        }

        const engineName =
            filteredEngines.find((e:Engine) => e.id === selectedEngine)?.en_name || ""

        router.push(
            `/SearchResult?brand=${selectedBrand}&model=${selectedModule}&year=${selectedYear}&engine=${engineName}`
        )
    }

    return (
        <div className={styles.search}>
            <Select
                options={data.brands.map((brand:Brand) => ({
                    value: brand.id,
                    label: brand.ar_name,
                }))}
                placeholder={t("searchSelectdBarnd")}
                className={styles.select}
                onChange={(option: SingleValue<Option>) => {
                    setSelectedBrand(option ? option.value : null)
                    setSelectedModule(null)
                    setSelectedYear(null)
                    setSelectedEngine(null)
                }}
                isClearable
            />

            <Select
                options={filteredModules.map((m:Module) => ({ value: m.id, label: m.ar_name }))}
                placeholder={t("searchSelectdModuel")}
                className={styles.select}
                onChange={(option: SingleValue<Option>) => {
                    setSelectedModule(option ? option.value : null)
                    setSelectedYear(null)
                    setSelectedEngine(null)
                }}
                isDisabled={!selectedBrand}
                isClearable
            />

            <Select
                options={yearsOptions}
                placeholder={t("searchSelectdYear")}
                className={styles.select}
                onChange={(option: SingleValue<Option>) =>
                    setSelectedYear(option ? option.value : null)
                }
                isDisabled={!selectedModule}
                isClearable
            />

            <Select
                options={filteredEngines.map((e:Engine) => ({
                    value: e.id,
                    label: e.ar_name,
                }))}
                placeholder={t("searchSelectdEngine")}
                className={styles.select}
                onChange={(option: SingleValue<Option>) =>
                    setSelectedEngine(option ? option.value : null)
                }
                isDisabled={!selectedModule}
                isClearable
            />

            <button type="button" onClick={handleSearch}>
                {t("searchBtn")}
            </button>
        </div>
    )
}

export default Search
