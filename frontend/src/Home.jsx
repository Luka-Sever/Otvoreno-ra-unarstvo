
export default function Home() {
    return (
        <>
        <h1>Popis nekih satelita koji kruže Zemljom</h1>
      <p>Ovdje su zapisani odabrani sateliti koji kruže Zemljom.
         Skup podataka zapisan je u JSON i CSV formatu. Podaci su dostupni pod licencijom 
          <a href="https://creativecommons.org/licenses/by-sa/3.0/hr/deed.hr"> CC BY-SA 3.0 HR</a>.</p>
      <table>
        <thead>
        <tr>
          <th>Skup otvorenih podataka</th>
          <th>Popis nekih od satelita koji kruže Zemljom</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>Autor</td>
            <td>Luka Sever</td>
          </tr>
          <tr>
            <td>Verzija</td>
            <td>2.0</td>
          </tr>
          <tr>
            <td>Jezik</td>
            <td>Hrvatski, engleski</td>
          </tr>
          <tr>
            <td>Broj satelita u bazi</td>
            <td>10</td>
          </tr>
          <tr>
            <td>Zadnja izmjena</td>
            <td>4.11.2025</td>
          </tr>        
        </tbody>
      </table>
      <a href='/sateliti.json' download="sateliti.json">Podaci u JSON formatu</a>
      <br/>
      <a href='/sateliti.csv' download="sateliti.csv">Podaci u CSV formatu</a>
      
    </>
    );
}