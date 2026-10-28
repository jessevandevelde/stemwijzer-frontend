import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Partij {
  naam: string;
  keuze: string;
  toelichting: string;
}

interface Stelling {
  titel: string;
  categorie: string;
  tekst: string;
  toelichting: string;
  economisch: string;
  maatschappelijk: string;
  partijen: Partij[];
}

@Component({
  selector: 'app-stelling-beheren',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stelling-beheren.component.html',
  styleUrl: './stelling-beheren.component.css'
})
export class StellingBeherenComponent implements OnInit {
  private readonly opslagSleutel = 'stemwijzer-stelling';

  stelling: Stelling = this.voorbeeldStelling();
  melding = '';

  ngOnInit(): void {
    const opgeslagen = localStorage.getItem(this.opslagSleutel);

    if (opgeslagen) {
      try {
        this.stelling = JSON.parse(opgeslagen) as Stelling;
      } catch {
        localStorage.removeItem(this.opslagSleutel);
      }
    }
  }

  opslaan(): void {
    if (!this.stelling.titel.trim() || !this.stelling.tekst.trim()) {
      this.melding = 'Vul een titel en stellingtekst in.';
      return;
    }

    localStorage.setItem(this.opslagSleutel, JSON.stringify(this.stelling));
    this.melding = 'Stelling opgeslagen.';
  }

  verwijderen(): void {
    if (!confirm('Weet je zeker dat je deze stelling wilt verwijderen?')) {
      return;
    }

    localStorage.removeItem(this.opslagSleutel);
    this.stelling = this.legeStelling();
    this.melding = 'Stelling verwijderd.';
  }

  annuleren(): void {
    const opgeslagen = localStorage.getItem(this.opslagSleutel);

    if (opgeslagen) {
      this.stelling = JSON.parse(opgeslagen) as Stelling;
    } else {
      this.stelling = this.voorbeeldStelling();
    }

    this.melding = 'Wijzigingen teruggedraaid.';
  }

  private legeStelling(): Stelling {
    return {
      titel: '',
      categorie: 'Wonen & Huisvesting',
      tekst: '',
      toelichting: '',
      economisch: 'Midden',
      maatschappelijk: 'Midden',
      partijen: []
    };
  }

  private voorbeeldStelling(): Stelling {
    return {
      titel: 'Hypotheekrenteaftrek',
      categorie: 'Wonen & Huisvesting',
      tekst: 'De hypotheekrenteaftrek moet worden afgeschaft.',
      toelichting: 'De hypotheekrenteaftrek stelt huiseigenaren in staat de rente op hun hypotheek af te trekken van hun inkomen.',
      economisch: 'Links',
      maatschappelijk: 'Progressief',
      partijen: [
        {
          naam: 'GroenLinks-PvdA',
          keuze: 'Eens',
          toelichting: 'De hypotheekrenteaftrek drijft prijzen op.'
        },
        {
          naam: 'VVD',
          keuze: 'Oneens',
          toelichting: 'Huizenbezitters moeten kunnen rekenen op stabiel beleid.'
        },
        {
          naam: 'NSC',
          keuze: 'Geen',
          toelichting: 'Niet direct afschaffen, wel geleidelijk herzien.'
        },
        {
          naam: 'D66',
          keuze: 'Eens',
          toelichting: 'Stapsgewijs afbouwen voor een eerlijk speelveld.'
        }
      ]
    };
  }
}