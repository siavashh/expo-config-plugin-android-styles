# Expo Config Plugin: Android Styles Modifier

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An Expo Config Plugin to programmatically modify the native Android `styles.xml` file during the prebuild process.

## Problem

Sometimes you need to customize native Android theme attributes that aren't directly exposed via React Native component props or standard Expo config options. Manually editing files in the `android` directory is discouraged in Expo managed projects.

Common examples include:

- Changing the accent color of native dialogs like the DatePicker or TimePicker.
- Setting a default `android:windowBackground`.
- Overriding specific theme items for `AppTheme` or other styles.

## Solution

This config plugin uses Expo's `withAndroidStyles` modifier to safely add or modify `<item>` tags within specified `<style>` tags in your `android/app/src/main/res/values/styles.xml` file.

## Compatibility

- Tested with Expo SDK 48+
- Requires `@expo/config-plugins` >= 7.0.0 (this is a peer dependency that should be provided by your Expo project)
- Requires `expo-build-properties` for native modifications

## Installation

```bash
npm install expo-config-plugin-android-styles
# or
yarn add expo-config-plugin-android-styles
```

## Usage

### Using app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-config-plugin-android-styles",
        {
          "styles": [
            {
              "styleName": "DialogDatePicker.Theme",
              "itemName": "colorAccent",
              "itemValue": "#8f78aa",
              "parentTheme": "Theme.AppCompat.Light.Dialog"
            },
            {
              "styleName": "AppTheme",
              "itemName": "android:datePickerDialogTheme",
              "itemValue": "@style/DialogDatePicker.Theme"
            },
            {
              "styleName": "AppTheme",
              "itemName": "android:timePickerDialogTheme",
              "itemValue": "@style/DialogDatePicker.Theme"
            }
          ]
        }
      ]
    ]
  }
}
```

### Using app.config.js

```javascript
const withAndroidStylesModifier = require("expo-config-plugin-android-styles");

module.exports = ({ config }) => {
  return {
    ...config,
    plugins: [
      [
        withAndroidStylesModifier,
        {
          styles: [
            {
              styleName: "DialogDatePicker.Theme",
              itemName: "colorAccent",
              itemValue: "#8f78aa",
              parentTheme: "Theme.AppCompat.Light.Dialog",
            },
            {
              styleName: "AppTheme",
              itemName: "android:datePickerDialogTheme",
              itemValue: "@style/DialogDatePicker.Theme",
            },
            {
              styleName: "AppTheme",
              itemName: "android:timePickerDialogTheme",
              itemValue: "@style/DialogDatePicker.Theme",
            },
          ],
        },
      ],
    ],
  };
};
```

## Configuration Options

The plugin accepts an options object with the following structure:

```typescript
interface StyleConfig {
  styleName: string; // The name of the style to modify/create
  itemName: string; // The name of the item to add/modify
  itemValue: string; // The value to set for the item
  parentTheme?: string; // Optional parent theme for new styles
}

interface PluginOptions {
  styles: StyleConfig[]; // Array of style configurations to apply
}
```

### Example: Customizing DatePicker/TimePicker Accent Color

To customize the DatePicker and TimePicker accent color:

```json
[
  "expo-config-plugin-android-styles",
  {
    "styles": [
      {
        "styleName": "DialogDatePicker.Theme",
        "itemName": "colorAccent",
        "itemValue": "#8f78aa",
        "parentTheme": "Theme.AppCompat.Light.Dialog"
      },
      {
        "styleName": "AppTheme",
        "itemName": "android:datePickerDialogTheme",
        "itemValue": "@style/DialogDatePicker.Theme"
      },
      {
        "styleName": "AppTheme",
        "itemName": "android:timePickerDialogTheme",
        "itemValue": "@style/DialogDatePicker.Theme"
      }
    ]
  }
]
```

## How it Works

This plugin hooks into the Expo prebuild process. It parses the existing styles.xml, allows you to programmatically add or modify style items using the configuration, and then writes the updated styles.xml back to the native android project directory.

## License

MIT License
