import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Examen {
  naam: string;
  beschrijving: string;
  status: string;
}

interface Kandidaat {
  initialen: string;
  naam: string;
  klas: string;
  resultaat: string;
  status: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  examens: Examen[] = [
    {
      naam: 'Rekenen niveau 4',
      beschrijving: 'Centraal examen rekenen voor mbo niveau 4',
      status: 'Ingepland'
    },
    {
      naam: 'Nederlands schrijven',
      beschrijving: 'Schriftelijk examen Nederlandse taal',
      status: 'Ingepland'
    },
    {
      naam: 'Engels spreken',
      beschrijving: 'Mondeling examen Engels op niveau A2',
      status: 'Concept'
    }
  ];

  kandidaten: Kandidaat[] = [
    {
      initialen: 'SZ',
      naam: 'Soufian Zeddi',
      klas: 'SD2A',
      resultaat: '8,1',
      status: 'Afgerond'
    },
    {
      initialen: 'MB',
      naam: 'Mohammed Bakker',
      klas: 'SD2A',
      resultaat: '7,4',
      status: 'Afgerond'
    },
    {
      initialen: 'YN',
      naam: 'Yassin Noor',
      klas: 'SD2B',
      resultaat: '-',
      status: 'Ingepland'
    },
    {
      initialen: 'LV',
      naam: 'Lars de Vries',
      klas: 'SD2B',
      resultaat: '6,8',
      status: 'Afgerond'
    }
  ];

  examenToevoegen(): void {
    alert('Hier komt later het formulier voor een nieuw examen.');
  }

  studentToevoegen(): void {
    alert('Hier komt later het formulier voor een nieuwe student.');
  }

  bewerken(naam: string): void {
    alert(`${naam} bewerken`);
  }
}
