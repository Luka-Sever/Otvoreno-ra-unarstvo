
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
            <td>8.11.2025</td>
          </tr>        
        </tbody>
      </table>
      <p>Sljedeća tablica opisuje atribute koji se nalaze u bazi podataka.</p>
      <table>
  <thead>
    <tr>
      <th>Atribut</th>
      <th>Značenje</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ime satelita</td>
      <td>Daje službeno ime satelita.</td>
    </tr>
    <tr>
      <td>drzava porijekla</td>
      <td>Govori koja je država proizvela satelit. Ako piše NR znači da nije poznata država, a npr. NR (9/21) znači da nije poznato od rujna 2021.</td>
    </tr>
    <tr>
      <td>drzava odrzavanja</td>
      <td>Koja država trenutačno održava satelit.</td>
    </tr>
    <tr>
      <td>vlasnik</td>
      <td>Institucija pod čijim je vlasništvom satelit.</td>
    </tr>
    <tr>
      <td>korist</td>
      <td>Tko ima korist od satelita.</td>
    </tr>
    <tr>
      <td>svrha</td>
      <td>Čemu je satelit namijenjen.</td>
    </tr>
    <tr>
      <td>orbita</td>
      <td>U kojoj se orbiti nalazi, zapisano na engleskome (LEO za nisku Zemljinu orbitu, itd.).</td>
    </tr>
    <tr>
      <td>apside</td>
      <td>Perigej je najbliža udaljenost od Zemlje (u km). Apogej je najdalja udaljenost od Zemlje (u km).</td>
    </tr>
    <tr>
      <td>inklinacija</td>
      <td>Daje inklinaciju, kut između ravnine gibanja satelita i ekliptike Zemlje (u stupnjevima).</td>
    </tr>
    <tr>
      <td>Period</td>
      <td>Koliko dugo vremena treba da napravi krug oko Zemlje (u minutama).</td>
    </tr>
  </tbody>
</table>

      <a href='/sateliti.json' download="sateliti.json">Podaci u JSON formatu</a>
      <br/>
      <a href='/sateliti.csv' download="sateliti.csv">Podaci u CSV formatu</a>
      
    </>
    );
}