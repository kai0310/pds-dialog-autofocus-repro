# Porsche Design System: no reliable way to focus an input when `p-modal` opens

Minimal reproduction for an issue in [porsche-design-system/porsche-design-system](https://github.com/porsche-design-system/porsche-design-system).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/kai0310/pds-dialog-autofocus-repro)

A modal with a form should move the focus to its first input when it opens. With `p-modal` (and `p-flyout`, `p-sheet`)
the result depends on the timing: `showDialog()` keeps the `<dialog>` `inert` around `showModal()` and then focuses the
dialog itself, so a `focus()` that runs too early is lost, and the `autofocus` attribute is ignored.

## How to use

Press each button. It opens the same modal with a `p-input-text` and tries one way to focus the input. The table shows
the focused element (followed through shadow roots) 0, 50, 100, 300 and 1000ms after opening.

## Results (Playwright 1.63, 3 runs each, `@porsche-design-system/components-js` 4.8.0)

| Strategy | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| `modal.open = true; input.focus()` | dialog | dialog | dialog |
| `focus()` in `requestAnimationFrame` | input | input | input |
| `focus()` in `setTimeout(…, 0)` | input | input | **dialog** |
| `focus()` on `motionVisibleEnd` | input after 300–1000ms | input after 300–1000ms | input after 300–1000ms |
| `autofocus` attribute on the input | dialog | dialog | dialog |

In a React 19 app (`PModal` with `open` state), `requestAnimationFrame` loses the focus to the dialog too, because the
new `open` value is rendered later. Only `motionVisibleEnd` works everywhere, and it waits for the opening transition.

## Setup

Same as the official Vanilla JS StackBlitz template of the Porsche Design System (fonts and loader script from the
partials), without Tailwind CSS and AG Grid.

```sh
npm install
npm run dev
```
