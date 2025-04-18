const { withAndroidStyles } = require("@expo/config-plugins");

/**
 * Adds or modifies an <item> within a specific <style> in styles.xml.
 * Creates the <style> if it doesn't exist.
 *
 * @param {object} styles - The parsed styles.xml object from withAndroidStyles.
 * @param {string} styleName - The name attribute of the <style> tag (e.g., "AppTheme", "MyCustomTheme").
 * @param {string} itemName - The name attribute of the <item> tag (e.g., "colorAccent", "android:windowBackground").
 * @param {string} itemValue - The desired value for the <item> tag (e.g., "#FF0000", "@color/my_color", "@style/MyOtherStyle").
 * @param {string} [parentTheme] - Optional. The parent theme if creating a new style (e.g., "Theme.AppCompat.Light.Dialog", "Theme.AppCompat.Light.NoActionBar"). Defaults based on common usage if not provided when creating.
 * @returns {object} The modified styles object.
 */
const addOrModifyAndroidStyleItem = (
  styles,
  styleName,
  itemName,
  itemValue,
  parentTheme
) => {
  let stylesJson = styles.resources.style;
  if (!Array.isArray(stylesJson)) {
    stylesJson = styles.resources.style ? [styles.resources.style] : [];
  }

  let targetStyle = stylesJson.find((s) => s.$.name === styleName);

  if (!targetStyle) {
    console.warn(`Style "${styleName}" not found in styles.xml. Creating it.`);
    // Determine a sensible default parent if not provided
    const defaultParent =
      parentTheme ||
      (styleName.includes("Dialog")
        ? "Theme.AppCompat.Light.Dialog"
        : "Theme.AppCompat.Light.NoActionBar");
    targetStyle = { $: { name: styleName, parent: defaultParent }, item: [] };
    if (!styles.resources.style) styles.resources.style = [];
    if (!Array.isArray(styles.resources.style))
      styles.resources.style = [styles.resources.style];
    styles.resources.style.push(targetStyle);
  }

  if (!targetStyle.item) {
    targetStyle.item = [];
  }

  let targetItem = targetStyle.item.find((i) => i.$.name === itemName);

  if (targetItem) {
    targetItem._ = itemValue;
  } else {
    targetStyle.item.push({ $: { name: itemName }, _: itemValue });
  }

  return styles;
};

/**
 * Expo Config Plugin to modify Android styles.xml.
 *
 * @param {object} config - Expo config object.
 * @param {object} options - Configuration options for the plugin.
 * @param {Array<object>} options.styles - Array of style configurations to apply.
 * @param {string} options.styles[].styleName - The name of the style to modify/create.
 * @param {string} options.styles[].itemName - The name of the item to add/modify.
 * @param {string} options.styles[].itemValue - The value to set for the item.
 * @param {string} [options.styles[].parentTheme] - Optional parent theme for new styles.
 * @returns {object} Modified Expo config object.
 */
const withAndroidStylesModifier = (config, options = {}) => {
  return withAndroidStyles(config, (config) => {
    let styles = config.modResults;

    // Apply each style configuration
    if (options.styles && Array.isArray(options.styles)) {
      options.styles.forEach((styleConfig) => {
        styles = addOrModifyAndroidStyleItem(
          styles,
          styleConfig.styleName,
          styleConfig.itemName,
          styleConfig.itemValue,
          styleConfig.parentTheme
        );
      });
    }

    config.modResults = styles;
    return config;
  });
};

module.exports = withAndroidStylesModifier;
