import React from "react";

const AlternativePartsTable = ({ alternativeParts }: {alternativeParts:any[]}) => {
    if (!alternativeParts || alternativeParts.length < 1) {
        return <p>لا توجد أرقام بديلة متاحة للمنتج.</p>;
    }



    const tdStyle = {
        border: "1px solid #333",
        padding: "8px",
    };

    const trHoverStyle = {
        backgroundColor: "#f9f9f9",
    };


    return (
        <table >
            <thead>
            <tr>
                <th >الشركة</th>
                <th >رقم البديل</th>
            </tr>
            </thead>
            <tbody>
            {alternativeParts.map((part, index) => (
                <tr key={index} style={index % 2 === 0 ? {} : trHoverStyle}>
                    <td style={tdStyle}>{part.company}</td>
                    <td style={tdStyle}>{part.part_number}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AlternativePartsTable;
