import { List } from 'immutable';

import { Crafter, Module, Recipe, Resource } from './factorio';

export interface CrafterDetails extends Crafter {
    readonly count: number;
    readonly modules: List<Module | null>;
}

export interface ProductionDetails extends Recipe {
    readonly resultRates: { readonly [name: string]: number };
    readonly crafters: List<CrafterDetails>;
}

export interface InvoiceDetail extends Resource {
    readonly rate: number;
}

export type DetailedInvoice = List<InvoiceDetail>;
