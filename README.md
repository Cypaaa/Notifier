# Notifier
## _Made by Cyprien_

Notifier is a simple open-source JavaScript code that shows on screen notification messages such as errors, warning, information or success messages.
It also provides a custom type to use your own css.
The provided CSS file is **not required** since the script inject its css.

## Features

- Custom notifications
- Error notifications
- Warning notifications
- Success notifications
- Information notifications

Each notification can handle a pre and a post notification callback (_optional_), a duration, a title and a message.
The duration can be from 0ms to forever (_if not set: can be ommited_).
The duration_bar indicates if yes or no, a bar should increase from the left to the right to show the remaining duration.
The message and the title should be a string.
The pre and post callbacks are optionals and can be ommited.

## How to start

The **css file** is useless since the JavaScript file inject its css into the page header.
Use `!important` to override any css rule.

First, import the .js file into your html header:

```HTML5
<script src="notifier.min.js"></script>
```

Then, in your JavaScript, make an instance of the Notifier class with a number from 1 to 9 to specify the notification position (1: top left, 9 bottom-right). The position is not required and is 1 (top-left) by default

```JavaScript
const notifier = new Notifier(9);

notifier.success({
    duration: 5000, // ms
    duration_bar: true,
    data: {
        title: "My notification title",
        message: "My notification message, it breaks to a new line if it's too long!"
    },
    precall: () => { console.log("before displaying the notification"); },
    postcall: () => { console.log("after displaying the notification"); }
});
```

## Notifier class

The constructor of the Notifier class takes a number from 1 to 9, which is not required but recommended, and modifiable at anytime using `notifier.setPosition(...)`.

## settings

When you make a notification, you pass some settings to a notifier instance method.
Except `data`, every setting can be ommited.
The complete object stucture is:

```JSON
{
    "data": { // required
        "title": "<String>", // ommitable
        "message": "<String>" // ommitable
    },
    "duration": "<Number>", // in ms, ommitable
    "duration_bar": "<Boolean>", // ommitable
    "precall": "<Callback>", // ommitable
    "postcall": "<Callback>" // ommitable
}
```

## License

MIT, you can use this code as your own, but no warrantly is provided.