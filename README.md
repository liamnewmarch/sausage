# Sausage

> Static site generator

## What?

It’s a static site generator. An SSG. Sausage. Get it? Ha ha. Moving on.

## No really, what?

Sausage is a really simple tool with zero dependencies for building static sites with vanilla JavaScript.

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

Run Sausage to build this to a `build` directory.

```shell
$ npx sausage
Building... done!
$ cat build/index.html
<p>Hello, world!</p>
```

Hurrah!
