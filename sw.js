/* Streak — Habit Tracker service worker
   Enables the app to display OS notifications and to be installable to the home
   screen. Notifications are scheduled from the page while it is open or in the
   background; this worker is responsible for showing them and for focusing the
   app when a notification is tapped. */

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

// Allow the page to ask the worker to show a notification.
self.addEventListener("message", function (e) {
  var d = e.data || {};
  if (d.type === "notify" && self.registration && self.registration.showNotification) {
    self.registration.showNotification(d.title || "Habit reminder", {
      body: d.body || "",
      tag: d.tag || "habit",
      icon: "icon-192.png",
      badge: "icon-192.png",
      renotify: false,
    });
  }
});

// Focus (or open) the app when a notification is clicked.
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
