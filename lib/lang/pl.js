"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  code: "pl",
  toolbar: {
    default: "Domyślne",
    save: "Zapisz",
    font: "Czcionka",
    formats: "Formaty",
    fontSize: "Rozmiar",
    bold: "Pogrubienie",
    underline: "Podkreślenie",
    italic: "Kursywa",
    strike: "Przekreślenie",
    subscript: "Indeks dolny",
    superscript: "Indeks górny",
    removeFormat: "Wyczyść formatowanie",
    fontColor: "Kolor tekstu",
    hiliteColor: "Kolor tła tekstu",
    indent: "Zwiększ wcięcie",
    outdent: "Zmniejsz wcięcie",
    align: "Wyrównaj",
    alignLeft: "Do lewej",
    alignRight: "Do prawej",
    alignCenter: "Do środka",
    alignJustify: "Wyjustuj",
    list: "Lista",
    orderList: "Lista numerowana",
    unorderList: "Lista wypunktowana",
    horizontalRule: "Pozioma linia",
    hr_solid: "Ciągła",
    hr_dotted: "Kropkowana",
    hr_dashed: "Przerywana",
    table: "Tabela",
    link: "Odnośnik",
    math: "Matematyczne",
    image: "Obraz",
    video: "Wideo",
    audio: "Audio",
    fullScreen: "Pełny ekran",
    showBlocks: "Pokaż bloki",
    codeView: "Widok kodu",
    undo: "Cofnij",
    redo: "Ponów",
    preview: "Podgląd",
    print: "Drukuj",
    tag_p: "Akapit",
    tag_div: "Blok (DIV)",
    tag_h: "Nagłówek H",
    tag_blockquote: "Cytat",
    tag_pre: "Kod",
    template: "Szablon",
    lineHeight: "Odstęp między wierszami",
    paragraphStyle: "Styl akapitu",
    textStyle: "Styl tekstu",
    imageGallery: "Galeria obrazów"
  },
  dialogBox: {
    linkBox: {
      title: "Wstaw odnośnik",
      url: "Adres URL",
      text: "Tekst do wyświetlenia",
      newWindowCheck: "Otwórz w nowym oknie"
    },
    mathBox: {
      title: "Matematyczne",
      inputLabel: "Zapis matematyczny",
      fontSizeLabel: "Rozmiar czcionki",
      previewLabel: "Podgląd"
    },
    imageBox: {
      title: "Wstaw obraz",
      file: "Wybierz plik",
      url: "Adres URL obrazka",
      altText: "Tekst alternatywny"
    },
    videoBox: {
      title: "Wstaw wideo",
      file: "Wybierz plik",
      url: "Adres URL video, np. YouTube/Vimeo"
    },
    audioBox: {
      title: "Wstaw audio",
      file: "Wybierz plik",
      url: "Adres URL audio"
    },
    browser: {
      tags: "Tagi",
      search: "Szukaj"
    },
    caption: "Wstaw opis",
    close: "Zamknij",
    submitButton: "Zatwierdź",
    revertButton: "Cofnij zmiany",
    proportion: "Ogranicz proporcje",
    basic: "Bez wyrównania",
    left: "Do lewej",
    right: "Do prawej",
    center: "Do środka",
    width: "Szerokość",
    height: "Wysokość",
    size: "Rozmiar",
    ratio: "Proporcje"
  },
  controller: {
    edit: "Edycja",
    unlink: "Usuń odnośnik",
    remove: "Usuń",
    insertRowAbove: "Wstaw wiersz powyżej",
    insertRowBelow: "Wstaw wiersz poniżej",
    deleteRow: "Usuń wiersz",
    insertColumnBefore: "Wstaw kolumnę z lewej",
    insertColumnAfter: "Wstaw kolumnę z prawej",
    deleteColumn: "Usuń kolumnę",
    fixedColumnWidth: "Stała szerokość kolumny",
    resize100: "Zmień rozmiar - 100%",
    resize75: "Zmień rozmiar - 75%",
    resize50: "Zmień rozmiar - 50%",
    resize25: "Zmień rozmiar - 25%",
    autoSize: "Rozmiar automatyczny",
    mirrorHorizontal: "Odbicie lustrzane w poziomie",
    mirrorVertical: "Odbicie lustrzane w pionie",
    rotateLeft: "Obróć w lewo",
    rotateRight: "Obróć w prawo",
    maxSize: "Maksymalny rozmiar",
    minSize: "Minimalny rozmiar",
    tableHeader: "Nagłówek tabeli",
    mergeCells: "Scal komórki",
    splitCells: "Podziel komórki",
    HorizontalSplit: "Podział poziomy",
    VerticalSplit: "Podział pionowy"
  },
  menu: {
    spaced: "Rozstawiony",
    bordered: "Z obwódką",
    neon: "Neon",
    translucent: "Półprzezroczysty",
    shadow: "Cień",
    code: "Kod"
  }
};
exports.default = _default;