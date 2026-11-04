import type React from 'react';
import {Aromatic} from './Aromatic';
import {BeH2} from './BeH2';
import {Benzene} from './Benzene';
import {Butadiene} from './Butadiene';
import {Catalyst} from './Catalyst';
import {Color} from './Color';
import {Hook} from './Hook';
import {Huckel} from './Huckel';
import {MetalCO} from './MetalCO';
import {Methane} from './Methane';
import {Organic} from './Organic';
import {Outro} from './Outro';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Salc} from './Salc';
import {Title} from './Title';
import {Water} from './Water';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  salc: Salc,
  beh2: BeH2,
  methane: Methane,
  water: Water,
  huckel: Huckel,
  butadiene: Butadiene,
  benzene: Benzene,
  aromatic: Aromatic,
  color: Color,
  metalco: MetalCO,
  catalyst: Catalyst,
  organic: Organic,
  recap: Recap,
  outro: Outro,
};
