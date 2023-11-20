Array.from(document.getElementsByClassName('notifications-list-item'))
  .map(e => e.children[0])
  .map(e => e.children[0])
  .map(e => e.children[1].href)
  .forEach(e => setTimeout(function () { window.open(e, "_blank") }, 500));