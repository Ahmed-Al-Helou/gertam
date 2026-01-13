import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Props {
    setBrand: (val: string | null) => void;
    setModel: (val: string | null) => void;
    setYear: (val: string | null) => void;
}

export default function SearchParamsWrapper({ setBrand, setModel, setYear }: Props) {
    const searchParams = useSearchParams(); // Hook على العميل فقط

    useEffect(() => {
        setBrand(searchParams.get("brand"));
        setModel(searchParams.get("model"));
        setYear(searchParams.get("year"));
    }, [searchParams]);

    return null;
}
