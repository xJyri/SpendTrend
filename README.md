# SpendTrend

SpendTrend on kevyt selainpohjainen kuluseuranta-appi (HTML + CSS + JavaScript), jossa voit:

- lisätä, muokata ja poistaa menokirjauksia
- asettaa kuukausibudjetin
- tarkastella menoja kuukausi- ja vuosinäkymässä
- tarkastella kaavioita kategorioittain ja kuukausittain
- käyttää sovellusta suomeksi tai englanniksi

---

## Tuotteen tila

- **Teknologiat:** `index.html`, `styles.css`, `app.js`, Chart.js CDN
- **Tallennus:** LocalStorage (`st_tx_*`, `st_bud_*`, `st_lang`)
- **Nykyinen näkyvä versio UI:ssa:** `v0.4.9`

---

## Käynnistysohjeet

### Vaihtoehto 1: avaa suoraan selaimeen

1. Siirry projektikansioon.
2. Avaa `index.html` selaimessa (tuplaklikkaus tai Open with Browser).

### Vaihtoehto 2: 

1. Siirry osoitteeseen https://xjyri.github.io/SpendTrend/

---

## Päivityshistoria (tiivistelmä)

### v0.4.9
- UI-viimeistelyä CSS: pehmeämpi visuaalinen ilme, taustagradientit, sticky-header, varjoja ja hover-parannuksia.

### v0.4.8
- Responsiivisuusparannuksia vuosi- ja mobiilinäkymiin (yläpalkki, gridit, chart-korkeudet).

### v0.4.7
- Kirjauksen muokkaus erilliseen modal-ikkunaan (ei enää "Lisää meno" -kentän kautta).
- Poisto-/muokkausnapit selkeämmiksi.

### v0.4.6
- Kuukausinollauksen UI:n selkeytys (pois budjettialueelta).

### v0.4.5
- Kuukausinollaukseen vahvistus ja vuosisivulle nollaus-ruksi.
- Headerin kk/vuosi-valinnan popup-käytöksen korjauksia.

### v0.4.4
- Ylävalitsimen kalenterityylin yhtenäistäminen.
- Vuosisivun kuukausikortteihin budjettirivin näyttö.

### v0.4.3
- Klikattava kk/vuosi-valinta yläpalkissa.
- Donitsin prosenttilabelin korjauksia.

### v0.4.2
- Numeroiden ryhmittelysyöttö (`1 000 000`), Enter-submitit, placeholder-korjauksia.

### v0.4.1
- Headerin kontrollien sijoittelun vakautus.
- Kielen vaihto yhdeksi napiksi.

### v0.4.0
- FI/EN-kielitoggle käyttöön.

---

## Huomioita

- Data on selainkohtaista. Jos tyhjennät selaimen sivustodatan, myös SpendTrend-data poistuu.
- Sovellus on tarkoitettu kevyeksi frontend-projektiksi ilman backendiä.
