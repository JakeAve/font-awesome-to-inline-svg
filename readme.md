# Font Awesome SVG Replacer

Replace Font Awesome `<i>` tags with inline svgs.

## Background

Font Awesome has some neat SVGs and most of them are free to use. One of my favorite features is the `<i>` tag syntax, which makes it easy to identify which svg is in my code.

Font Awesome also uses fonts, which means thier SVGs can be styled with CSS properties like `color`, `font-size`, etc.

The downside is Font Awesome uses a lame script tag with heaven-knows-what going in the background. It also needs to download all the fonts if a user does not have them cached in the browser. 

## Goals

- The goal of this small project is to take the `<i>` tags with Font Awesome classes and replace them with thier corresponding inline SVGs.

- It would be nice to be able to transform the HTML behind the scenes, so the dev can see the `<i>` tag in their sourcecode, but it's going to be modified sometime before being distributed.

- As a bonus, it would be great to transpile CSS, SCSS or SASS from using the font properties to using SVG-agreeable properties like `fill` and `height`.
