var deferredPrompt;
var enableNotoficationsButtons = document.querySelectorAll(
  ".enable-notifications"
);

if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function() {
      console.log("Service worker registered!");
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener("beforeinstallprompt", function(event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ("serviceWorker" in navigator) {
    var options = {
      body: "You successfully subscribe to our notification service",
      icon: "/src/images/icons/app-icon-96x96.png",
      image: "/src/images/sf-boat.jpg",
      dir: "ltr",
      lang: "en-US",
      vibrate: [100, 50, 200],
      badge: "/src/images/icons/app-icon-96x96.png",
      tag: "confirm-notification"
    };
    navigator.serviceWorker.ready.then(swreg => {
      swreg.showNotification("Successfully subscribed FROM SW", options);
    });
  }

  // new Notification("Successfully subscribed", options);
}

function askForNotificationPermission() {
  Notification.requestPermission(result => {
    console.log("User Choice", result);
    if (result !== "granted") {
      console.log("No notification permission granted");
    } else {
      displayConfirmNotification();
    }
  });
}

if ("Notification" in window) {
  for (var i = 0; i < enableNotoficationsButtons.length; i++) {
    enableNotoficationsButtons[i].style.display = "inline-block";
    enableNotoficationsButtons[i].addEventListener(
      "click",
      askForNotificationPermission
    );
  }
}
