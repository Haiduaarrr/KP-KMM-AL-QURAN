const nomorsurat = getURL("nomor");
const judulSurat = document.querySelector(".judul-surat");
const isisurat = document.querySelector(".isi-surat");
const loader = document.querySelector(".loader");
const error = `<div class="loader text-danger">Opps, terjadi kesalahan</div>`;
const cardError = document.querySelector(".card");

function getURL(e) {
  const pageURL = window.location.search.substring(1);
  const urlVariable = pageURL.split("&");

  for (let i = 0; i < urlVariable.length; i++) {
    const parameter = urlVariable[i].split("=");
    if (parameter[0] == e) {
      return parameter[1];
    }
  }
}

async function getSurat() {
  try {
    cardError.classList.add("hidden-loader");
    await getUIDetail(nomorsurat);
    loader.classList.add("hidden-loader");
    cardError.classList.remove("hidden-loader");
  } catch (err) {
    loader.classList.add("hidden-loader");
    isisurat.innerHTML = error;
  }
}

function getUIDetail(nomorsurat) {
  // ✅ PERBAIKAN: return promise supaya bisa di-await
  return fetch(`https://equran.id/api/surat/${nomorsurat}`)
    .then((response) => {
      if (!response.ok) throw new Error("Gagal mengambil data surat.");
      return response.json();
    })
    .then((response) => {
      // Title surat
      const titleSurat = document.querySelector("#title-surat");
      titleSurat.textContent = `Surat ${response.nama_latin}`;
      // End title surat

      // Judul surat
      const cardJudulSurat = `
        <strong>${response.nama_latin} - ${response.nama}</strong>
        <p>Jumlah ayat: ${response.jumlah_ayat} (${response.arti})</p>
        <button class="btn btn-primary audio-button-play">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-play-circle-fill"
            viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
          </svg>
          Dengarkan
        </button>
        <button class="btn btn-danger hidden-button audio-button-pause">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-pause-circle-fill"
            viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
          </svg>
          Berhenti
        </button>
        <audio id="audio-tag" src="${response.audio}"></audio>
      `;
      judulSurat.innerHTML = cardJudulSurat;
      // End judul surat

      // Isi surat
      let isiHTML = "";
      response.ayat.forEach((ayat) => {
        isiHTML += `
        <div class="mb-4">
          <p class="text-muted nomor-ayat">Ayat ${ayat.nomor}</p>
          <h3 class="text-end arabic mt-4" dir="rtl mb-4">${ayat.ar}</h3>
          <p><em>${ayat.tr}</em></p>
          <p>${ayat.idn}</p>
        </div>
        `;
      });
      isisurat.innerHTML = isiHTML;
      // End isi surat

      // Button audio
      const audioButtonPlay = document.querySelector(".audio-button-play");
      const audioButtonPause = document.querySelector(".audio-button-pause");
      const audioTag = document.querySelector("#audio-tag");

      audioButtonPlay.addEventListener("click", () => {
        audioTag.play();
        audioButtonPlay.classList.add("hidden-button");
        audioButtonPause.classList.remove("hidden-button");
      });

      audioButtonPause.addEventListener("click", () => {
        audioTag.pause();
        audioButtonPause.classList.add("hidden-button");
        audioButtonPlay.classList.remove("hidden-button");
      });
    });
}

getSurat();
