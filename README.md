# fix-react-refresh-plugin
This Vite plugin helps overcome a problem of not reloading some React components after saving changes.

**Note that this plugin does not fix this issue, but only applies a workaround. Before use, check whether the problem has been resolved at the level of the modules responsible for HMR.**

## Background
If you are using lazily loaded class components additionally wrapped in HOCs then HMR problem can occur. We faced these types of issues when moving our app from Create React App to Vite. The foundation of our source code was created many years ago and we still use class components in many places and cannot easily rewrite them. While debugging, we noticed that if we add a functional component to a class component module, then reloading works. Here is an example:

🔴 This code does not work.
```jsx
import { lazy, Suspense, Component } from 'react';

const Tool = lazy(() => import('./Tool');

class MyComponent extends Component {
  render() {
    return (
      <div>
        {someCondition && (
          <Suspense>
            <Tool />
          </Suspense>
        )}
      </div>
    );
  }
);

export default withHoc(MyComponent);
```
🟢 This code does work.
```jsx
import { lazy, Suspense, Component } from 'react';

const Tool = lazy(() => import('./Tool');

const NoopFC = () => null; // Here is an empty functional component.

class MyComponent extends Component {
  render() {
    return (
      <div>
        {someCondition && (
          <Suspense>
            <Tool />
          </Suspense>
        )}
      </div>
    );
  }
);

export default withHoc(MyComponent);
```

Therefore, we came up with an idea for a plugin that will automatically add an empty functional component to class component modules to force refreshing. If you need more information about this error and alternative ways to resolve it, check out [this issue](https://github.com/vitejs/vite-plugin-react/issues/133).

## Usage
Install the plugin via your package manager:
```
npm i -D fix-react-refresh-plugin
```
Import and apply it to your `vite.config.js` file:
```js
import fixReactRefresh from 'fix-react-refresh-plugin';

export default defineConfig({
  plugins: [
    {
      ...fixReactRefresh(),
      enforce: 'pre',
    },
    react()
  ]
});
```
⚠️ `fixReactRefresh()` must be set **before `react()`** and must have `enforce` set to `pre`.

## Configuration
The plugin is prepared to work right out of the box, but for more sophisticated cases you may need to change the configuration. Below is a list of configurable options:
| Property name | Description | Type | Default value | Required |
| ------------- | ----------- | ---- | ------------- | -------- |
| `componentFileNameRegEx` | Match the pattern of React component files. | `RegExp` | `/\.(jsx\|tsx)/` | No |
| `classComponentDeclarationRegEx` | Match the pattern of React class components declarations. | `RegExp` | `/(export(\sdefault)*)*\s*class\s+\w+\s+extends\s+(React.(Component\|PureComponent)\|(Component\|PureComponent))/gm` | No |
|  `noopFunctionalComponentName` | The name of the added noop function that forces component reloading. You must use the PascalCase notation and avoid special characters.  | `string` | `FixReactRefreshFC` | No |