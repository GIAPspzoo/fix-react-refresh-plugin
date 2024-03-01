import {
  defaultComponentFileNameRegEx,
  defaultClassComponentDeclarationRegEx,
} from './regex';

import type { PluginImpl } from 'rollup';
import type { TFixReactRefreshPluginConfig } from './types';

const fixReactRefresh: PluginImpl<TFixReactRefreshPluginConfig> = (config) => {
  const options = {
    componentFileNameRegEx: defaultComponentFileNameRegEx,
    classComponentDeclarationRegEx: defaultClassComponentDeclarationRegEx,
    noopFunctionalComponentName: 'FixReactRefreshFC',
    ...config,
  };

  return {
    name: 'fix-react-refresh',
    apply: 'serve',

    transform(code, id) {
      if (
        process.env.NODE_ENV !== 'development' ||
        !options.componentFileNameRegEx.test(id)
      ) {
        return code;
      }

      const classDeclaration = code.match(
        options.classComponentDeclarationRegEx,
      )?.[0];

      if (classDeclaration) {
        return code.replace(
          classDeclaration,
          `\nconst ${options.noopFunctionalComponentName} = () => null;\n${classDeclaration}`,
        );
      }

      return code;
    },
  };
};

export default fixReactRefresh;
