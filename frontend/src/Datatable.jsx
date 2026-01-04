import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Papa from "papaparse"

DataTable.use(DT);

export default function Datatable() {
    const table = useRef();
    const [tableInstance, setTableInstance] = useState(null);
    const downloadLinkJson = useRef();
    const downloadLinkCsv = useRef();
    const [searchColumn, setSearchColumn] = useState("all");
    const searchColumnRef = useRef(searchColumn)
    
    const columns = [
        'Ime satelita',
        'Država porijekla',
        'Država održavanja',
        'Vlasnik',
        'Korist',
        'Svrha',
        'Orbita',
        'Perigej',
        'Apogej',
        'Inklinacija',
        'Period'
    ];

    const keys = ["ime satelita", "drzava porijekla", "drzava odrzavanja", "vlasnik", "korist", "svrha", "orbita", "perigej", "apogej", "inklinacija", "period"];
    
    // podaci koji će biti prikazani na stranici
    const dtColumns = keys.map(k => ({data: k, title: columns[keys.indexOf(k)]}));
    const searchValueRef = useRef("");

    useEffect(() => {
        searchColumnRef.current = searchColumn;
    }, [searchColumn])

    useEffect(() => {
        if (!table.current) return;
        const dt = table.current.dt();
        setTableInstance(dt);

        const input = document.querySelector('#dt-search-1');

        if (!input) return;

        const handleSearchInput = (e) => {
            searchValueRef.current = e.target.value;
            dt.ajax.reload(); // moramo zvat isvaki puta kada se promijeni pretraživanje
        };

        input.addEventListener('input', handleSearchInput);

        return () => {
            input.removeEventListener('input', handleSearchInput);
        };
    }, []);

    const handleDropdownChange = useCallback((e) => {
        setSearchColumn(e.target.value);
        if (tableInstance)
            tableInstance.ajax.reload();
    }, [tableInstance]);

    const ajaxOption = useCallback(() => ({
        url: "http://localhost:3000/search",
        type: "GET",
        data: function (d) {
            d.customSearchColumn = searchColumnRef.current;
            d.customSearchValue = searchValueRef.current;
        }
    }), []);


    // ovaj useEffect stvara linkove za preuzimanje
    useEffect(() => {
        if (!table.current) return;
        const dt = table.current.dt();

        const updateDownloadLinks = () => {
            const filteredData = dt.rows({ search: "applied" }).data().toArray();

            // pretvori array od arraya u array s objektima
            const transform = (data) =>
                data.map(row => {
                    const obj = {};
                    keys.forEach((key) => {
                        obj[key] = row[key];
                    });
                    return obj;
                });


            // fora operator, ako je current undefined i čitamo property href
            // dobit ćemo error da ne možemo čitati udnefined
            // ovako je ovo automatizirano
            if (downloadLinkJson.current?.href)
                URL.revokeObjectURL(downloadLinkJson.current.href);
            if (downloadLinkCsv.current?.href)
                URL.revokeObjectURL(downloadLinkCsv.current.href);

            const jsonBlob = new Blob([JSON.stringify(transform(filteredData), null, 2)], {
                type: "application/json",
            });
            downloadLinkJson.current.href = URL.createObjectURL(jsonBlob);
            downloadLinkJson.current.download = "filteredData.json";

            const csvRows = filteredData.map(row => keys.map(k => row[k]));
            const csvData = [columns, ...csvRows];
            const csvString = Papa.unparse(csvData);
            const csvBlob = new Blob([csvString], { type: "text/csv" });
            downloadLinkCsv.current.href = URL.createObjectURL(csvBlob);
            downloadLinkCsv.current.download = "filteredData.csv";
        };

        dt.on("draw", updateDownloadLinks);
        return () => {
            dt.off("draw", updateDownloadLinks);
            if (downloadLinkJson.current?.href) URL.revokeObjectURL(downloadLinkJson.current.href);
            if (downloadLinkCsv.current?.href) URL.revokeObjectURL(downloadLinkCsv.current.href);
        };
    }, [columns, keys]);


    return (
        <>
            <br />
            <label htmlFor='filter'>Traži po atributu: </label>
            <select id="filter" 
                    value={searchColumn}
                    onChange={handleDropdownChange}
            >
                <option value="all">(Svi stupci)</option>
                {keys.map((key, index) => (
                    <option key={index} value={key}>{columns[index]}</option>
                ))}
            </select>
            <DataTable 
                ref={table}
                ajax={ajaxOption()}
                columns={dtColumns}
                options={{
                    processing: true,
                    serverSide: true,
                    searching: true,
                    columnDefs: [
                        {searchable: false, targets: "_all"}
                        ]
                    }
                }>
                <thead>
                    <tr>
                        {columns.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </DataTable>
            <a ref={downloadLinkJson} >Podaci u JSON formatu</a><br />
            <a ref={downloadLinkCsv} >Podaci u CSV formatu</a>
        </>
    );
}