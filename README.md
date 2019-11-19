# Static

Static is a really simple tool with minimal dependencies for building static sites with vanilla JavaScript.

The build process revolves around pages and templates.

Pages live in the `content` folder and are .js files that export things.

Templates live in the `templates` folder and are .js files that export a function. This function returns a string for a given page.

## How?

Here’s an absurdly simple hello world example.

Imagine this is your page content.

```js
// pages/index.js
export const title = 'Hello, world!';
export const template = 'home';
```

And this is your template.

```js
// templates/home.js
export default ({ title }) => `<p>${title}</p>`;
```

Run static to build this to a `build` directory.

```shell
$ npx @liamnewmarch/static
Building... done!
$ cat build/index.html
<p>Hello, world!</p>
```

Hurrah!
