const withAndroidStylesModifier = require("expo-config-plugin-android-styles");

module.exports = ({ config }) => {
  return {
    ...config,
    plugins: [
      // ... your other plugins
      [
        withAndroidStylesModifier,
        {
          styles: [
            // Example: Change DatePicker Accent Color
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
            // Add more style modifications as needed
            {
              styleName: "AppTheme",
              itemName: "android:windowBackground",
              itemValue: "@color/white",
            },
          ],
        },
      ],
    ],
  };
};
