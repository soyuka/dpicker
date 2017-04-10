# Stylesheets

## Minimal

```css
td.dpicker-inactive {
  color: grey;
}

button.dpicker-active {
  background: coral;
}

.dpicker-invisible {
  display: none;
}

.dpicker-visible {
  display: block;
}
```

## Foundation

```css
@import 'foundation';

$black: #2f3439 !default;
$white: #fefefe !default;
$alt-white: #f0f0f0 !default;

label.dpicker .dpicker-container { top: inherit; }

.dpicker {
  position: relative;

  .dpicker-container {
    background: $white;
    border: $black;
    flex-wrap: wrap;
    justify-content: space-between;
    left: 0;
    padding: 15px;
    position: absolute;
    top: ($input-font-size + ($form-spacing * 1.5) - rem-calc(1));
    width: 300px;
    z-index: 2;

    &.dpicker-invisible { display: none; }
    &.dpicker-visible { display: flex; }

    select {
      flex: 0 0 49%;
    }

    .dpicker-time {
      display: flex;

      select {
        flex: 0 0 30%;
      }
    }

    table {
      color: $black;
      text-align: center;
      $dpicker-hover: scale-color($alt-white, $lightness: -20%);

      td {
        border: 1px solid $black;
        border-collapse: collapse;
        height: 40px;
        width: 40px;
      }

      .dpicker-inactive {
        color: scale-color($black, $lightness: 50%);
        font-size: $small-font-size;
      }

      .dpicker-active button {

        @include button($expand: true, $background: $alt-white, $background-hover: $dpicker-hover)

        border: 0;
        color: inherit;
        height: 100%;
        margin: 0;
        padding: 0;

        &.dpicker-active {
          background-color: $dpicker-hover;
        }
      }
    }
  }
}
```

## Bootstrap

From the [demo](_demo) (scss)

```css
@import 'bootstrap';

@mixin form-control {
  display: block;
  width: 100%;
  height: $input-height-base; // Make inputs at least the height of their button counterpart (base line-height + padding + border)
  padding: $padding-base-vertical $padding-base-horizontal;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: $input-color;
  background-color: $input-bg;
  background-image: none; // Reset unusual Firefox-on-Android default style; see https://github.com/necolas/normalize.css/issues/214
  border: 1px solid $input-border;
  border-radius: $input-border-radius; // Note: This has no effect on <select>s in some browsers, due to the limited stylability of <select>s in CSS.
  @include box-shadow(inset 0 1px 1px rgba(0,0,0,.075));
  @include transition(border-color ease-in-out .15s, box-shadow ease-in-out .15s);

  // Customize the `:focus` state to imitate native WebKit styles.
  @include form-control-focus;

  // Placeholder
  @include placeholder;

  // Unstyle the caret on `<select>`s in IE10+.
  &::-ms-expand {
    border: 0;
    background-color: transparent;
  }

  // Disabled and read-only inputs
  //
  // HTML5 says that controls under a fieldset > legend:first-child won't be
  // disabled if the fieldset is disabled. Due to implementation difficulty, we
  // don't honor that edge case; we style them as disabled anyway.
  &[disabled],
  &[readonly],
  fieldset[disabled] & {
    background-color: $input-bg-disabled;
    opacity: 1; // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655
  }

  &[disabled],
  fieldset[disabled] & {
    cursor: $cursor-disabled;
  }
}

@mixin button {
  display: inline-block;
  width: 100%;
  margin-bottom: 0; // For input.btn
  font-weight: $btn-font-weight;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none; // Reset unusual Firefox-on-Android default style; see https://github.com/necolas/normalize.css/issues/214
  border: 1px solid transparent;
  white-space: nowrap;
  @include button-size($padding-base-vertical, $padding-base-horizontal, $font-size-base, $line-height-base, 0);
  @include user-select(none);
  @include button-variant($btn-default-color, $btn-default-bg, transparent);

  &,
  &:active,
  &.active {
    &:focus,
    &.focus {
      @include tab-focus;
    }
  }

  &:hover,
  &:focus,
  &.focus {
    color: $btn-default-color;
    text-decoration: none;
  }
}

.dpicker {
  .dpicker-invalid {
    border: 1px solid #e65100;
  }

  @include form-inline;

  input, select {
    @include form-control;
  }

  .dpicker-inactive {
    color: lighten(#111, 50%);
  }

  .dpicker-next-month::before {
    content: '\2771';
  }

  .dpicker-previous-month::before {
    content: '\2770';
  }

  .dpicker-previous-month.dpicker-invisible, .dpicker-next-month.dpicker-invisible{
    visibility: hidden;
  }

  .dpicker-container {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    right: 0;
    z-index: 2;
    background: #fff;
    border: 1px solid darken(#fff, 20%);
    padding: 15px;
    min-width: 500px;
    text-align: center;
    justify-content: space-between;

    &.dpicker-invisible {
      display: none;
    }

    .dpicker-time {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      flex: 0 0 100%;

      select {
        display: inline-block;
        width: auto;
        margin: 0 10px;
      }
    }

    .dpicker-previous-month, .dpicker-next-month {
      background: transparent;
      border: 0;
      flex: 0 0 10%;
    }

    select {
      flex: 0 0 30%;
    }

    table {
      text-align: center;
      border-collapse: 'collapse';
      margin: 10px auto 0;
      width: 90%;

      td.dpicker-inactive {
        padding: 7px 8px;
      }

      th {
        text-align: center;
      }

      button {
        @include button();
        @include button-size(6px, 8px, $font-size-base, $line-height-base, 3px);

        &.dpicker-active {
          @include button-variant(#111, #ffab40, darken(#ffab40, 20%));
        }
      }
    }
  }
}

```

## Contributed

By [jonwilkinson](https://github.com/soyuka/dpicker/issues/4)

```css
.dpicker-container table {
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid rgba(0,0,0,.05);
    border-radius: 3px;
    -webkit-box-shadow: 1px 1px 4px 0px rgba(0,0,0,0.5);
    -moz-box-shadow: 1px 1px 4px 0px rgba(0,0,0,0.5);
    box-shadow: 1px 1px 4px 0px rgba(0,0,0,0.5);
}

.dpicker-container button,
.dpicker-container td,
.dpicker-container th {
    font-size: 1em;  /* overall calendar size */
    height: 2em; /* tweak to add vertical spacing to calendar */
    min-width: 1em; /* tweak to add horizontal spacing to calendar */
    text-align: center;
}

.dpicker-inactive { color: rgba(0,0,0,.2); }
select[name="dpicker-year"], select[name="dpicker-month"] { margin: 1em 2em 1em 0em; }
.dpicker-active button.dpicker-active { background-color: #FFFBCC; font-weight:bold; }
.dpicker-container, .dpicker-container button {  font-size: 100%; font: inherit; vertical-align: baseline; }
.dpicker-container { margin:.5em; }
.dpicker-active, .dpicker-inactive {border: 1px solid rgba(0,0,0,.05); }
.dpicker-active button { border:none; width: 100%; background: none; }
.dpicker-active button:hover { background: rgba(0,0,0,.05); cursor: pointer; }
.dpicker-invisible { display: none; }
.dpicker-visible { display: block; }
```
