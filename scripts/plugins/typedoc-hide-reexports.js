/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
import { ReflectionKind, Converter } from 'typedoc';

export function load({ application }) {
  application.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    for (const reflection of context.project.getReflectionsByKind(ReflectionKind.Reference)) {
      context.project.removeReflection(reflection);
    }
  });
}
