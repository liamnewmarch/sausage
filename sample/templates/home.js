export default ({ title }) => `
<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link href="static/style.css" rel="stylesheet">
  </head>
  <body>
    <p>${title}</p>
  </body>
</html>
`;
