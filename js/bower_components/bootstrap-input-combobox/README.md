# Bootstrap Combobox

Real combobox with text underlying data based on Twitter Bootstrap and LESS. This jQuery plugin is modified bootstrap-combobox plugin https://github.com/danielfarrell/bootstrap-combobox

## Options

Initialisation of plugin

    $('.combobox').inputCombobox();

When activating the plugin, you may include an object containing options for the combobox

`menu`: Custom markup for the dropdown menu list element.

`item`: Custom markup for the dropdown menu list items.

`matcher`: Custom function with one `item` argument that compares the item to the input. Defaults to matching on the query being a substring of the item, case insenstive

`sorter`: Custom function that sorts a list `items` for display in the dropdown

`highlighter`: Custom function for highlighting an `item`. Defaults to bolding the query within a matched item

`template`: Custom function that returns markup for the combobox.

## Dependencies
Uses the latest 1.X version of jQuery and the 3.X of bootstrap.
