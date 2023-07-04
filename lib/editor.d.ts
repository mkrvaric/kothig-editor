import { KothingEditorOptions } from './options';
import KothingEditor from './lib/core';

declare namespace _default {
    export function init(init_options: KothingEditorOptions): { create: typeof create; };
    export function create(idOrElement: String | Element, options: KothingEditorOptions, _init_options?: KothingEditorOptions): KothingEditor;
}

export default _default;
