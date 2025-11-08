import axios from 'axios';
import { use, useEffect, useRef, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import Papa from "papaparse"

import './App.css'

DataTable.use(DT);

export default function Datatable() {
    const table = useRef();
    const downloadLinkJson = useRef();
    const downloadLinkCsv = useRef();

    const [rowData, setRowData] = useState([]);
    const [searchColumn, setSearchColumn] = useState("all");
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

    // ovaj useEffect dobiva podatke iz baze
    useEffect(() => {
        axios.get("http://localhost:3000/api/data").then((res) => {
            const data = res.data; // podaci iz odgovora

            // izaberi koje podatke koje želimo prikazati (ne zanima nas _id)
            const transformedRows = data.map(obj => keys.map(key => obj[key]));
            setRowData(transformedRows);
        });
        1
    }, []);

    useEffect(() => {
        if (!table.current) return;
        const dt = table.current.dt();

        const input = document.querySelector('#dt-search-1');

        if (!input) return;

        const handleSearchInput = (e) => {
            const val = e.target.value;

            if (searchColumn === 'all') {
                dt.columns().search('');
                dt.search(val).draw();
            } else {
                const colIndex = keys.indexOf(searchColumn);
                if (colIndex === -1) return;

                dt.search('').columns().search('');
                dt.column(colIndex).search(val).draw();
            }
        };

        input.addEventListener('input', handleSearchInput);

        return () => {
            input.removeEventListener('input', handleSearchInput);
        };
    }, [searchColumn, keys]);

    // ovaj useEffect stvara linkove za preuzimanje
    useEffect(() => {
        if (!table.current) return;
        const dt = table.current.dt();

        const getFilteredData = () => dt.rows({ search: "applied" }).data().toArray();

        const updateDownloadLinks = () => {
            const filteredData = getFilteredData();

            // pretvori array od arraya u array s objektima
            const transform = (data) =>
                data.map(row => {
                    const obj = {};
                    keys.forEach((key, i) => {
                        obj[key] = row[i];
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

            const csvData = [columns, ...filteredData];
            const csvString = Papa.unparse(csvData);
            const csvBlob = new Blob([csvString], { type: "text/csv" });
            downloadLinkCsv.current.href = URL.createObjectURL(csvBlob);
            downloadLinkCsv.current.download = "filteredData.csv";
        };

        dt.on("search.dt", updateDownloadLinks);

        updateDownloadLinks();

        return () => {
            dt.off("search.dt", updateDownloadLinks);
            if (downloadLinkJson.current?.href) URL.revokeObjectURL(downloadLinkJson.current.href);
            if (downloadLinkCsv.current?.href) URL.revokeObjectURL(downloadLinkCsv.current.href);
        };
    }, [rowData, columns, keys]);


    return (
        <>
            <br />
            <label htmlFor='filter'>Traži po atributu: </label>
            <select id="filter" value={searchColumn}
                onChange={e => setSearchColumn(e.target.value)}
            >
                <option value="all">(Svi stupci)</option>
                {keys.map((key, index) => (
                    <option key={index} value={key}>{columns[index]}</option>
                ))}
            </select>
            <DataTable data={rowData} ref={table}>
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