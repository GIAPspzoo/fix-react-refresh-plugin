export const defaultComponentFileNameRegEx = /\.(jsx|tsx)/;

/**
 * Handled cases:
 *
 * class MyComponent extends React.Component
 * class MyComponent extends Component
 * class MyComponent extends React.PureComponent
 * class MyComponent extends PureComponent
 * export class MyComponent extends React.Component
 * export class MyComponent extends Component
 * export class MyComponent extends React.PureComponent
 * export class MyComponent extends PureComponent
 * export default class MyComponent extends React.Component
 * export default class MyComponent extends Component
 * export default class MyComponent extends React.PureComponent
 * export default class MyComponent extends PureComponent
 */
export const defaultClassComponentDeclarationRegEx =
  /(export(\sdefault)*)*\s*class\s+\w+\s+extends\s+(React.(Component|PureComponent)|(Component|PureComponent))/gm;
