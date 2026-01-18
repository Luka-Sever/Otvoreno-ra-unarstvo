
export default function JsonLd({ satellites }) {
    if (!satellites) return null;
    const ldList = {
        "@context" : {
            "@vocab" : "http://schema.org/",
            "@type" : "ItemList",
            "name" : "Popis satelita",
            "description" : "Podaci o nekim satelitima oko Zemlje",
            "numberOfItems" : satellites.length,
            "itemListOrder" : "Unordered",
            "itemListElement" : satellites.map((satellite, index) => ({
                "@type" : "ListItem",
                "position" : index + 1,
                "item" : {
                    "@type" : "Product",
                    "name" : satellite["ime satelita"],
                    "description" : "Satelit s glavnim svojim značajkama",
                    "additionalProperty": [
                        { "@type" : "PropertyValue", "name" : "Država održavanja", "value": satellite["drzava odrzavanja"] },
                        { "@type" : "PropertyValue", "name" : "Vlasnik", "value": satellite.vlasnik },
                        { "@type" : "PropertyValue", "name" : "Orbita", "value": satellite.orbita },
                        { "@type" : "PropertyValue", "name" : "Svrha", "value" : satellite.svrha },
                        { "@type" : "PropertyValue", "name" : "Perigej", "value": `${satellite.perigej}` },
                        { "@type" : "PropertyValue", "name" : "Apogej", "value": `${satellite.apogej}` },
                        { "@type" : "PropertyValue", "name" : "Inklinacija", "value": `${satellite.inklinacija}` },
                        { "@type" : "PropertyValue", "name" : "Period", "value": `${satellite.period}` }
                    ]
                }
            }))
        }
    }
    
    return (
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{__html : JSON.stringify(ldList)}}>
        </script>
    );
}